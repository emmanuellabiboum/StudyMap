import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { scholarships } from "../../lib/data";
import ScholarshipCard from "../components/ScholarshipCard";
import RevealGrid from "../components/RevealGrid";

const heading = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const COUNTRIES = Array.from(new Set(scholarships.map((s) => s.country))).sort();

export default function ScholarshipsPage() {
  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("");

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    return scholarships.filter(
      (s) =>
        (!country || s.country === country) &&
        (!q || [s.name, s.org, s.country, s.description].some((v) => v.toLowerCase().includes(q)))
    );
  }, [term, country]);

  return (
    <>
      <section className="bg-white pt-12 pb-8 px-4 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-foreground mb-2" style={heading}>Bourses</h1>
          <p className="text-muted-foreground mb-6">Explorez les opportunités de bourses ({scholarships.length})</p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une bourse, un organisme, un pays…"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {term && (
                <button onClick={() => setTerm("")} aria-label="Effacer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="py-3 px-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Tous les pays</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">Aucune bourse trouvée.</p>
              <button onClick={() => { setTerm(""); setCountry(""); }}
                className="mt-3 text-sm text-accent font-semibold hover:underline">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <RevealGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" resetKey={`${term}|${country}`}>
              {results.map((s) => <ScholarshipCard key={s.id} s={s} />)}
            </RevealGrid>
          )}
        </div>
      </section>
    </>
  );
}
