import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useEffect } from "react";
import FooterLinks from "./FooterLinks";

const LINKS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/scholarships", label: "Bourses" },
  { to: "/guides", label: "Guides" },
  { to: "/universities", label: "Universités" },
];

const heading = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-sm font-semibold text-accent"
      : "text-sm text-muted-foreground hover:text-foreground transition-colors";

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-8">
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-black tracking-tight">SM</span>
              </div>
              <span className="font-black text-foreground text-base tracking-tight" style={heading}>studyMap</span>
            </Link>

            <div className="hidden md:flex items-center gap-7 flex-1">
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>
              ))}
            </div>

            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="md:hidden ml-auto p-2 text-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {open && (
            <div className="md:hidden border-t border-border py-3 space-y-1">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    "block px-2 py-2 rounded-lg hover:bg-secondary transition-colors text-sm " +
                    (isActive ? "font-semibold text-accent" : "text-muted-foreground")
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            studyMap, permet aux étudiants africains d'accéder aux meilleures opportunités d'études.
          </p>
          <p className="text-xs text-muted-foreground">© 2026 studyMap. Tous droits réservés.</p>
          <FooterLinks />
        </div>
      </footer>
    </div>
  );
}