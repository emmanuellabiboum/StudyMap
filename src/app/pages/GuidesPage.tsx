import { useState, useEffect } from "react";
import { BookOpen, FileText, Mail, Globe, Clock, GraduationCap, X, ExternalLink, Search, Lightbulb } from "lucide-react";
import { guides, Guide } from "../../lib/data";
import RevealGrid from "../components/RevealGrid";

const getIconForGuide = (iconType: string) => {
  const iconProps = { className: "w-8 h-8 text-accent" };
  switch (iconType) {
    case "GraduationCap":
      return <GraduationCap {...iconProps} />;
    case "BookOpen":
      return <BookOpen {...iconProps} />;
    case "FileText":
      return <FileText {...iconProps} />;
    case "Mail":
      return <Mail {...iconProps} />;
    case "Globe":
      return <Globe {...iconProps} />;
    case "Briefcase":
      return <FileText {...iconProps} />;
    case "Home":
      return <BookOpen {...iconProps} />;
    case "Trophy":
      return <GraduationCap {...iconProps} />;
    case "DollarSign":
      return <Globe {...iconProps} />;
    default:
      return <BookOpen {...iconProps} />;
  }
};

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredGuides = searchTerm
    ? guides.filter(g =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : guides;

  useEffect(() => {
    document.body.style.overflow = selectedGuide ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedGuide]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedGuide(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>

      <section className="bg-white pt-12 pb-8 px-4 border-b border-border">
        <div className="max-w-7xl mx-auto space-y-4">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Guides
            </h1>
            <p className="text-muted-foreground">
              Ressources et guides pour vous accompagner dans votre parcours
            </p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un guide..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
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
          {filteredGuides.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">
                {searchTerm ? `Aucun guide trouvé pour « ${searchTerm} »` : "Aucun guide disponible"}
              </p>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mt-3 text-sm text-accent font-semibold hover:underline">
                  Réinitialiser la recherche
                </button>
              )}
            </div>
          ) : (
            <>
              {searchTerm && (
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredGuides.length} résultat{filteredGuides.length > 1 ? "s" : ""} pour « {searchTerm} »
                </p>
              )}
              <RevealGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" resetKey={searchTerm}>
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.slug}
                    onClick={() => setSelectedGuide(guide)}
                    className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-all cursor-pointer hover:border-accent/30 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      {getIconForGuide(guide.icon_type)}
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                        {guide.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-2 leading-tight"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{guide.read_time} de lecture</span>
                      </div>
                      <span className="text-xs text-accent font-semibold">Lire →</span>
                    </div>
                  </div>
                ))}
              </RevealGrid>
            </>
          )}
        </div>
      </section>

      {selectedGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedGuide(null); }}
        >
          <div
            className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl flex flex-col"
            style={{ maxHeight: "92vh" }}
          >
            <div className="flex items-start justify-between p-6 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                {getIconForGuide(selectedGuide.icon_type)}
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {selectedGuide.category}
                  </span>
                  <h2 className="font-black text-foreground text-lg mt-1 leading-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {selectedGuide.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shrink-0 ml-4"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              <p className="text-muted-foreground leading-relaxed">{selectedGuide.intro}</p>

              {selectedGuide.sections.map((section, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="font-bold text-foreground text-base"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
                  {section.link && (
                    <a href={section.link.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-accent font-semibold hover:underline mt-1">
                      {section.link.label}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}

              {selectedGuide.tip && (
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-accent mb-1"><Lightbulb className="w-4 h-4" />Conseil StudyMap</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedGuide.tip}</p>
                </div>
              )}

              {selectedGuide.useful_links && selectedGuide.useful_links.length > 0 && (
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Liens utiles</p>
                  <div className="space-y-2">
                    {selectedGuide.useful_links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-sm text-accent hover:underline py-1"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center text-xs text-muted-foreground pt-2 border-t border-border">
                <Clock className="w-3 h-3 mr-1" />
                <span>{selectedGuide.read_time} de lecture</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
