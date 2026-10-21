from __future__ import annotations

import argparse
import json
import re
import sys
import time
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "scholarships.json"
SOURCES = Path(__file__).resolve().parent / "sources.json"
REPORT = Path(__file__).resolve().parent / "last_report.md"

USER_AGENT = "StudyMapBot/1.0 (+https://github.com/emmanuellabiboum/StudyMap)"
DELAY_PER_HOST = 2.0
TIMEOUT = 20.0

MONTHS = {
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6, "july": 7,
    "august": 8, "september": 9, "october": 10, "november": 11, "december": 12,
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "jun": 6, "jul": 7, "aug": 8, "sep": 9, "sept": 9,
    "oct": 10, "nov": 11, "dec": 12,
    "janvier": 1, "février": 2, "fevrier": 2, "mars": 3, "avril": 4, "mai": 5, "juin": 6,
    "juillet": 7, "août": 8, "aout": 8, "septembre": 9, "octobre": 10, "novembre": 11,
    "décembre": 12, "decembre": 12, "janv": 1, "févr": 2, "fevr": 2, "avr": 4, "juil": 7,
    "déc": 12,
}
_MONTH_RE = "|".join(sorted(MONTHS, key=len, reverse=True))

DATE_PATTERNS = [
    (re.compile(r"\b(20\d{2})-(\d{1,2})-(\d{1,2})\b"), lambda m: (int(m[1]), int(m[2]), int(m[3]))),
    (re.compile(rf"\b(\d{{1,2}})(?:st|nd|rd|th|er)?\s+(?:of\s+)?({_MONTH_RE})\.?,?\s+(20\d{{2}})\b", re.I),
     lambda m: (int(m[3]), MONTHS[m[2].lower()], int(m[1]))),
    (re.compile(rf"\b({_MONTH_RE})\.?\s+(\d{{1,2}})(?:st|nd|rd|th)?,?\s+(20\d{{2}})\b", re.I),
     lambda m: (int(m[3]), MONTHS[m[1].lower()], int(m[2]))),
    (re.compile(r"\b(\d{1,2})[/.](\d{1,2})[/.](20\d{2})\b"), lambda m: (int(m[3]), int(m[2]), int(m[1]))),
]

KEYWORDS = re.compile(
    r"(deadline|closing date|close[sd]? on|apply by|applications? (?:close|due|must be)|"
    r"date limite|date de cl[ôo]ture|cl[ôo]ture|candidatures? (?:jusqu|avant)|avant le)",
    re.I,
)
WINDOW = 160


def find_dates(text: str) -> list[tuple[date, int]]:
    found = []
    for pattern, build in DATE_PATTERNS:
        for m in pattern.finditer(text):
            try:
                y, mo, d = build(m)
                found.append((date(y, mo, d), m.start()))
            except ValueError:
                continue
    return sorted(found, key=lambda t: t[1])


def extract_deadline(text: str, today: date | None = None) -> tuple[date, str] | None:
    today = today or date.today()
    text = re.sub(r"\s+", " ", text)
    candidates: list[tuple[date, str]] = []
    for kw in KEYWORDS.finditer(text):
        window = text[kw.start(): kw.end() + WINDOW]
        for d, pos in find_dates(window):
            if d >= today:
                candidates.append((d, window[: max(pos + 30, 60)].strip()))
                break
    if not candidates:
        return None
    return min(candidates, key=lambda c: c[0])


class PoliteClient:
    def __init__(self):
        import httpx
        self.http = httpx.Client(headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT, follow_redirects=True)
        self._robots: dict[str, RobotFileParser | None] = {}
        self._last: dict[str, float] = {}

    def _robots_for(self, url: str) -> RobotFileParser | None:
        host = urlparse(url).netloc
        if host in self._robots:
            return self._robots[host]
        rp: RobotFileParser | None = RobotFileParser()
        robots_url = f"{urlparse(url).scheme}://{host}/robots.txt"
        try:
            r = self.http.get(robots_url)
            if r.status_code == 200:
                rp.parse(r.text.splitlines())
            elif r.status_code in (401, 403) or r.status_code >= 500:
                rp = None
            else:
                rp.parse([])
        except Exception:
            rp = None
        self._robots[host] = rp
        return rp

    def allowed(self, url: str) -> bool:
        rp = self._robots_for(url)
        return rp is not None and rp.can_fetch(USER_AGENT, url)

    def get(self, url: str):
        if not self.allowed(url):
            return None, "interdit par robots.txt (ou robots.txt inaccessible)"
        host = urlparse(url).netloc
        wait = DELAY_PER_HOST - (time.time() - self._last.get(host, 0))
        if wait > 0:
            time.sleep(wait)
        try:
            r = self.http.get(url)
            self._last[host] = time.time()
            return r, None
        except Exception as e:
            self._last[host] = time.time()
            return None, f"{type(e).__name__}: {e}"


def check_scholarship(s: dict, cfg: dict, client: PoliteClient, today: date, apply_candidates: bool) -> list[str]:
    from bs4 import BeautifulSoup

    notes: list[str] = []
    url = cfg.get("url", s["url"])
    resp, err = client.get(url)
    s["last_checked"] = today.isoformat()

    if resp is None:
        s["link_ok"] = None
        return [f"AVERTISSEMENT {s['name']}: non vérifiée — {err}"]

    s["link_ok"] = resp.status_code < 400
    if not s["link_ok"]:
        return [f"ERREUR {s['name']}: HTTP {resp.status_code} sur {url}"]

    text = BeautifulSoup(resp.text, "html.parser").get_text(" ")
    hit = extract_deadline(text, today)
    if not hit:
        notes.append(f"INFO {s['name']}: lien OK, aucune date limite trouvée")
        return notes

    d, evidence = hit
    iso = d.isoformat()
    trusted = cfg.get("trust_dates", False)
    if trusted:
        if s.get("deadline_date") != iso:
            notes.append(f"OK {s['name']}: date limite {s.get('deadline_date')} → {iso} (source de confiance)")
            s["deadline_date"], s["source"] = iso, "scraped"
        s.pop("deadline_candidate", None)
    else:
        s["deadline_candidate"], s["deadline_evidence"] = iso, evidence[:200]
        if apply_candidates and not s.get("deadline_date"):
            s["deadline_date"], s["source"] = iso, "scraped-unverified"
            notes.append(f"À VÉRIFIER {s['name']}: date {iso} APPLIQUÉE sans vérification — « {evidence[:90]} »")
        else:
            notes.append(f"CANDIDATE {s['name']}: date {iso} à vérifier — « {evidence[:90]} »")
    return notes


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def parse_listing(html: str, base_url: str, cfg: dict) -> list[dict]:
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "html.parser")
    out = []
    for item in soup.select(cfg["item"]):
        name_el = item.select_one(cfg["name"])
        link_el = item.select_one(cfg.get("link", "a"))
        if not name_el:
            continue
        name = re.sub(r"\s+", " ", name_el.get_text(" ")).strip()
        href = link_el.get("href") if link_el else None
        if not name or not href:
            continue
        desc_el = item.select_one(cfg["description"]) if cfg.get("description") else None
        entry = {
            "id": slugify(name),
            "name": name,
            **cfg.get("defaults", {}),
            "url": urljoin(base_url, href),
            "description": re.sub(r"\s+", " ", desc_el.get_text(" ")).strip() if desc_el else "",
            "deadline_date": None,
            "deadline_note": "À confirmer sur le site officiel",
            "last_checked": None,
            "link_ok": None,
            "source": f"scraped:{cfg['id']}",
            "review": "pending",
        }
        out.append(entry)
    return out


def run_listings(cfgs: list[dict], data: list[dict], client: PoliteClient, today: date) -> list[str]:
    notes, known = [], {s["id"] for s in data} | {s["url"] for s in data}
    for cfg in cfgs:
        if not cfg.get("enabled"):
            continue
        resp, err = client.get(cfg["url"])
        if resp is None or resp.status_code >= 400:
            notes.append(f"AVERTISSEMENT liste {cfg['id']}: {err or 'HTTP ' + str(resp.status_code)}")
            continue
        items = parse_listing(resp.text, cfg["url"], cfg)
        if not items:
            notes.append(f"AVERTISSEMENT liste {cfg['id']}: 0 élément — les sélecteurs CSS ne correspondent plus ?")
            continue
        new = [i for i in items if i["id"] not in known and i["url"] not in known]
        for i in new:
            i["last_checked"] = today.isoformat()
            data.append(i)
            known |= {i["id"], i["url"]}
        notes.append(f"NOUVEAU liste {cfg['id']}: {len(items)} trouvées, {len(new)} nouvelles (à relire : review=pending)")
    return notes


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scraper StudyMap", formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="n'écrit aucun fichier")
    ap.add_argument("--only", help="id d'une bourse à vérifier (ex: chevening-scholarship)")
    ap.add_argument("--apply-candidates", action="store_true",
                    help="applique les dates candidates quand aucune date n'existe (non vérifiées !)")
    ap.add_argument("--skip-listings", action="store_true")
    args = ap.parse_args(argv)

    data = json.loads(DATA.read_text(encoding="utf-8"))
    sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    defaults = sources["check"].get("_defaults", {})
    overrides = sources["check"].get("overrides", {})
    today = datetime.now(timezone.utc).date()
    client = PoliteClient()
    report: list[str] = []

    for s in list(data):
        if args.only and s["id"] != args.only:
            continue
        if s.get("review") == "pending":
            continue
        cfg = {**defaults, **overrides.get(s["id"], {})}
        report += check_scholarship(s, cfg, client, today, args.apply_candidates)

    if not args.skip_listings and not args.only:
        report += run_listings(sources.get("listings", []), data, client, today)

    text = f"# Rapport du scraper — {today.isoformat()}\n\n" + "\n".join(f"- {l}" for l in report) + "\n"
    print(text)
    if args.dry_run:
        print("(dry-run : rien n'a été écrit)")
        return 0
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    REPORT.write_text(text, encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
