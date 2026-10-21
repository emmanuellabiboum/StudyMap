# studyMap

Bourses, universités et guides pour les étudiants africains. **Site 100 % statique** : pas de serveur, pas de base de données à héberger, pas de compte.

## Architecture

```
data/*.json  ──►  site React (Vite)  ──►  GitHub Pages
     ▲
     └── scraper/scrape.py (GitHub Action, chaque lundi)
```

| Fichier | Contenu | Mis à jour par |
|---|---|---|
| `data/scholarships.json` | bourses | toi + scraper |
| `data/guides.json` | guides (29) | toi |
| `data/universities.json` | universités | toi |
| `data/portals.json` | portails officiels | toi |

Les jours restants sont **calculés dans le navigateur** à partir de `deadline_date` : ils ne sont jamais périmés.

## Développer

```bash
npm install
npm run dev          # http://localhost:5173/StudyMap/
npm run typecheck && npm run build
python3 scraper/validate.py   # vérifie les JSON
```

## Ajouter / corriger une bourse à la main

Édite `data/scholarships.json`. Mets `"deadline_date": "2026-12-01"` (format AAAA-MM-JJ) ; sans date, la carte affiche « À confirmer ». Une date saisie à la main n'est **jamais écrasée** par le scraper.

## Le scraper

```bash
pip install -r scraper/requirements.txt
python scraper/scrape.py --dry-run     # montre ce qui changerait, n'écrit rien
python scraper/scrape.py               # écrit data/ + scraper/last_report.md
python -m unittest discover scraper    # tests
```

- **check** : pour chaque bourse, vérifie que le lien répond (`link_ok`) et cherche une date limite. Elle est rangée dans `deadline_candidate` avec l'extrait de texte trouvé ; elle n'est affichée sur le site que si la source a `"trust_dates": true` dans `scraper/sources.json`. Lis `scraper/last_report.md`, puis recopie les dates correctes dans `deadline_date`.
- **listings** : découvre de nouvelles bourses sur une page de liste (sélecteurs CSS dans `sources.json`). Elles arrivent avec `"review": "pending"` (cachées) ; supprime ce champ pour les publier.
- Respecte `robots.txt`, 2 s entre deux requêtes sur le même site, User-Agent identifiable.

Pour activer une source de liste : copie l'entrée `exemple-desactive`, ouvre la page dans ton navigateur (clic droit → Inspecter) pour trouver les sélecteurs, mets `"enabled": true`, teste avec `--dry-run`.

## Déploiement

- `deploy.yml` : à chaque push sur `main` (valide les données, typecheck, build, publie sur Pages).
- `scrape.yml` : chaque lundi + bouton manuel ; commit les changements puis relance le déploiement.

Réglages GitHub requis : *Settings → Pages → Source : GitHub Actions* et *Settings → Actions → General → Workflow permissions : Read and write*.
