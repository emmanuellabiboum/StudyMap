import { useState } from "react";
import { Search, X, ExternalLink, GraduationCap, DollarSign, Award, Globe, Check } from "lucide-react";
import { universities } from "../../lib/data";
import RevealGrid from "../components/RevealGrid";

export default function UniversitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = searchTerm
    ? universities.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.programs.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : universities;

  return (
    <>

      <section className="bg-white pt-12 pb-8 px-4 border-b border-border">
        <div className="max-w-7xl mx-auto space-y-4">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Universités
            </h1>
            <p className="text-muted-foreground">
              Universités accessibles aux étudiants africains — publiques, abordables, avec bourses
            </p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par pays, filière, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">Aucune université trouvée pour « {searchTerm} »</p>
              <button onClick={() => setSearchTerm("")} className="mt-3 text-sm text-accent font-semibold hover:underline">
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <>
              {searchTerm && (
                <p className="text-sm text-muted-foreground mb-4">
                  {filtered.length} résultat{filtered.length > 1 ? "s" : ""} pour « {searchTerm} »
                </p>
              )}
              <RevealGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" resetKey={searchTerm}>
                {filtered.map((uni) => (
                  <div
                    key={uni.id}
                    className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-all hover:border-accent/30 hover:-translate-y-0.5 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-6 h-6 text-accent flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-foreground text-sm leading-tight"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {uni.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{uni.city}, {uni.country}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-secondary text-muted-foreground flex-shrink-0 ml-2">
                        {uni.type}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-accent mb-2">{uni.ranking}</p>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
                      {uni.description}
                    </p>

                    <div className="flex items-start gap-1.5 mb-2">
                      <DollarSign className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-green-700 font-medium">{uni.cost}</p>
                    </div>

                    <div className="flex items-start gap-1.5 mb-3">
                      <Award className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">{uni.scholarship}</p>
                    </div>

                    <div className="flex items-center gap-1.5 mb-3">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex gap-1 flex-wrap">
                        {uni.languages.map(lang => (
                          <span key={lang} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {uni.programs.slice(0, 3).map((prog) => (
                        <span key={prog} className="text-xs bg-orange-50 text-accent border border-orange-100 px-2 py-0.5 rounded-full">
                          {prog}
                        </span>
                      ))}
                      {uni.programs.length > 3 && (
                        <span className="text-xs text-muted-foreground px-2 py-0.5">
                          +{uni.programs.length - 3} autres
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {uni.tags.map(tag => (
                        <span key={tag} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-medium">
                          <span className="inline-flex items-center gap-1"><Check className="w-3 h-3" />{tag}</span>
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-border">
                      <a
                        href={uni.admissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Portail d'admission
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </RevealGrid>
            </>
          )}
        </div>
      </section>
    </>
  );
}