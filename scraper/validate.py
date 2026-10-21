import json, sys
from datetime import date
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
errors = []

def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))

sch = load("scholarships.json")
ids = [s["id"] for s in sch]
for dup in {i for i in ids if ids.count(i) > 1}:
    errors.append(f"bourse: id en double « {dup} »")
for s in sch:
    for field in ("id", "name", "org", "country", "url", "description"):
        if not s.get(field):
            errors.append(f"bourse {s.get('id', '?')}: champ « {field} » manquant")
    if s.get("url") and not s["url"].startswith(("http://", "https://")):
        errors.append(f"bourse {s['id']}: url invalide")
    if s.get("deadline_date"):
        try:
            date.fromisoformat(s["deadline_date"])
        except ValueError:
            errors.append(f"bourse {s['id']}: deadline_date « {s['deadline_date']} » n'est pas AAAA-MM-JJ")

slugs = [g["slug"] for g in load("guides.json")]
for dup in {i for i in slugs if slugs.count(i) > 1}:
    errors.append(f"guide: slug en double « {dup} »")

print(f"{len(sch)} bourses, {len(slugs)} guides, {len(load('universities.json'))} universités, {len(load('portals.json'))} portails")
if errors:
    print("\n".join("ERREUR " + e for e in errors)); sys.exit(1)
print("Données valides")
