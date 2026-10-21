import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

const CONTACT_EMAIL = "biboumanneemmanuella@gmail.com";

const heading = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const PAGES: Record<string, { label: string; title: string; body: ReactNode }> = {
  about: {
    label: "À propos",
    title: "À propos de studyMap",
    body: (
      <>
        <p>
          studyMap centralise des bourses, des universités et des guides pratiques pour aider les étudiants
          africains à préparer leurs études supérieures à l'étranger.
        </p>
        <p>
          Les informations viennent des sites officiels des organismes. Les dates et conditions peuvent changer :
          vérifiez toujours sur le site officiel avant de candidater.
        </p>
      </>
    ),
  },
  privacy: {
    label: "Confidentialité",
    title: "Confidentialité",
    body: (
      <>
        <p>
          studyMap ne demande aucun compte, ne collecte aucune donnée personnelle et ne contient ni publicité
          ni outil de statistiques.
        </p>
        <p>
          Le site est hébergé par GitHub Pages et utilise Google Fonts pour les polices : ces services peuvent
          enregistrer des données techniques (comme ton adresse IP) selon leurs propres politiques.
        </p>
        <p>Les liens « Site officiel » mènent vers des sites tiers, dont nous ne contrôlons pas le contenu.</p>
      </>
    ),
  },
  contact: {
    label: "Contact",
    title: "Contact",
    body: (
      <p>
        Une erreur, une bourse à ajouter, une question ? Écris-nous à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent font-semibold hover:underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
};

export default function FooterLinks() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openKey && !dialog.open) dialog.showModal();
    if (!openKey && dialog.open) dialog.close();
  }, [openKey]);

  const page = openKey ? PAGES[openKey] : null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs leading-5 text-muted-foreground">
        {Object.entries(PAGES).map(([key, p]) => (
          <button
            key={key}
            type="button"
            onClick={() => setOpenKey(key)}
            className="text-xs leading-5 transition-colors hover:text-foreground"
          >
            {p.label}
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpenKey(null)} 
        onClick={(e) => e.target === e.currentTarget && setOpenKey(null)} 
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl p-0 backdrop:bg-black/50"
      >
        {page && (
            <div className="max-h-[80vh] overflow-y-auto overscroll-contain">
            <div className="sticky top-0 bg-white flex items-start justify-between gap-4 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-black text-foreground" style={heading}>{page.title}</h2>
              <button
                type="button"
                onClick={() => setOpenKey(null)}
                aria-label="Fermer"
                className="p-1 rounded-lg text-muted-foreground hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed p-6">{page.body}</div>
          </div>
        )}
      </dialog>
    </>
  );
}