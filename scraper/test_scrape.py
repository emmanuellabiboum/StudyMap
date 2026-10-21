import sys, unittest
from datetime import date
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import scrape

TODAY = date(2026, 10, 21)


class Dates(unittest.TestCase):
    def test_formats(self):
        cases = {
            "Application deadline: 15 November 2026": date(2026, 11, 15),
            "Closing date: November 3rd, 2026 at 17:00 GMT": date(2026, 11, 3),
            "Date limite de candidature : 1er décembre 2026": date(2026, 12, 1),
            "Date limite : 15/01/2027": date(2027, 1, 15),
            "Deadline 2026-12-31": date(2026, 12, 31),
            "Candidatures jusqu'au 20 févr. 2027": date(2027, 2, 20),
        }
        for text, expected in cases.items():
            hit = scrape.extract_deadline(text, TODAY)
            self.assertIsNotNone(hit, text)
            self.assertEqual(hit[0], expected, text)

    def test_ignore_passe_et_sans_mot_cle(self):
        self.assertIsNone(scrape.extract_deadline("Deadline: 15 March 2026", TODAY))
        self.assertIsNone(scrape.extract_deadline("Publié le 5 novembre 2026 par la rédaction", TODAY))
        self.assertIsNone(scrape.extract_deadline("Deadline: 31/02/2027", TODAY))

    def test_prend_la_plus_proche(self):
        t = "Round 2 deadline: 10 January 2027. Round 1 deadline: 5 November 2026."
        self.assertEqual(scrape.extract_deadline(t, TODAY)[0], date(2026, 11, 5))


LISTING = """
<main>
  <article class="scholarship"><h2>Bourse Alpha</h2><p>Pour masters.</p><a href="/s/alpha">Voir</a></article>
  <article class="scholarship"><h2>Bourse Beta</h2><a href="https://autre.org/beta">Voir</a></article>
  <article class="scholarship"><h2>Sans lien</h2></article>
</main>"""
CFG = {"id": "t", "item": "article.scholarship", "name": "h2", "link": "a", "description": "p",
    "defaults": {"org": "Org", "country": "Pays", "amount": "?", "tag": "?"}}


class Listing(unittest.TestCase):
    def test_parse(self):
        items = scrape.parse_listing(LISTING, "https://exemple.org/liste", CFG)
        self.assertEqual([i["id"] for i in items], ["bourse-alpha", "bourse-beta"])
        self.assertEqual(items[0]["url"], "https://exemple.org/s/alpha")
        self.assertEqual(items[1]["url"], "https://autre.org/beta")
        self.assertEqual(items[0]["review"], "pending")
        self.assertIsNone(items[0]["deadline_date"])


class FakeResp:
    def __init__(self, text, status=200): self.text, self.status_code = text, status

class FakeClient:
    def __init__(self, resp, err=None): self.resp, self.err = resp, err
    def get(self, url): return self.resp, self.err


def sample():
    return {"id": "x", "name": "X", "url": "https://x.org", "deadline_date": None, "source": "manual"}

PAGE = "<html><body><p>Application deadline: 15 November 2026</p></body></html>"


class Check(unittest.TestCase):
    def test_source_non_fiable_ne_publie_pas(self):
        s = sample()
        scrape.check_scholarship(s, {"trust_dates": False}, FakeClient(FakeResp(PAGE)), TODAY, False)
        self.assertIsNone(s["deadline_date"])
        self.assertEqual(s["deadline_candidate"], "2026-11-15")
        self.assertTrue(s["link_ok"])

    def test_source_de_confiance_publie(self):
        s = sample()
        scrape.check_scholarship(s, {"trust_dates": True}, FakeClient(FakeResp(PAGE)), TODAY, False)
        self.assertEqual(s["deadline_date"], "2026-11-15")
        self.assertEqual(s["source"], "scraped")

    def test_apply_candidates_ne_ecrase_jamais_une_date_manuelle(self):
        s = {**sample(), "deadline_date": "2026-12-01"}
        scrape.check_scholarship(s, {}, FakeClient(FakeResp(PAGE)), TODAY, True)
        self.assertEqual(s["deadline_date"], "2026-12-01")

    def test_lien_mort_et_reseau_en_panne(self):
        s = sample()
        scrape.check_scholarship(s, {}, FakeClient(FakeResp("", 404)), TODAY, False)
        self.assertFalse(s["link_ok"])
        s = sample()
        notes = scrape.check_scholarship(s, {}, FakeClient(None, "TimeoutException"), TODAY, False)
        self.assertIsNone(s["link_ok"])
        self.assertIn("non vérifiée", notes[0])


if __name__ == "__main__":
    unittest.main()
