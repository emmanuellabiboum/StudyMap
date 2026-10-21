import { Link } from "react-router";
import { Award, Globe, BookOpen, ExternalLink, ArrowRight, GraduationCap, CheckCircle, Users } from "lucide-react";
import { scholarships, guides, portals } from "../../lib/data";
import ScholarshipCard from "../components/ScholarshipCard";
import ScrollReveal from "../components/ScrollReveal";

const heading = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function HomePage() {
  const stats = [
    { value: scholarships.length, label: "Bourses référencées", icon: Award },
    { value: new Set(scholarships.map((s) => s.country)).size, label: "Pays de destination", icon: Globe },
    { value: guides.length, label: "Guides pratiques", icon: BookOpen },
  ];

  return (
    <>
      <section className="bg-white pt-14 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <ScrollReveal>
              <h1 className="text-4xl lg:text-[52px] font-black text-foreground leading-[1.12] mb-5" style={heading}>
                Votre passerelle vers<br />
                <span className="text-accent">l'éducation mondiale</span>
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                Découvrez des opportunités de bourses et rejoignez les universités de vos rêves
                grâce à leurs portails officiels d'admission.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/scholarships"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm">
                  <Award className="w-4 h-4" /> Explorer les bourses
                </Link>
                <Link to="/guides"
                  className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold px-6 py-3.5 rounded-xl hover:bg-secondary transition-colors text-sm">
                  Lire les guides
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal className="relative hidden lg:block" delay={120}>
              <div className="relative rounded-2xl overflow-hidden bg-secondary h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1777186475752-fb520366b805?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Jeunes étudiants africains sur un campus universitaire"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 to-transparent" />
              </div>
              <div className="absolute -top-4 -right-4 bg-accent text-white rounded-2xl shadow-xl p-4">
                <Award className="w-5 h-5 mb-1.5" />
                <p className="text-sm font-bold leading-tight">Sources officielles</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-primary py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <ScrollReveal key={label} className="text-center" delay={stats.findIndex((stat) => stat.label === label) * 70}>
              <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="text-2xl font-black text-white" style={heading}>{value}</p>
              <p className="text-xs text-white/50 mt-1 font-medium">{label}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-16 px-4">
        <ScrollReveal className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">À la une</p>
              <h2 className="text-2xl font-black text-foreground" style={heading}>Bourses à découvrir</h2>
            </div>
            <Link to="/scholarships" className="flex items-center gap-1.5 text-sm text-accent font-semibold hover:underline">
              Toutes les bourses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {scholarships.slice(0, 4).map((s) => (
              <ScholarshipCard key={s.id} s={s} className="flex-shrink-0 w-[300px] sm:w-[350px]" />
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="py-16 px-4 bg-white border-y border-border">
        <ScrollReveal className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Admission</p>
          <h2 className="text-2xl font-black text-foreground" style={heading}>Portails officiels</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-8">Plateformes accessibles aux étudiants africains</p>

          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {portals.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 w-[300px] sm:w-[320px] bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all flex flex-col group hover:border-accent/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-6 h-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-bold text-foreground text-sm leading-tight" style={heading}>{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.country}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-accent border border-orange-200 flex-shrink-0 ml-2 whitespace-nowrap">
                    {p.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">{p.desc}</p>
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-2.5 py-1.5 mb-3">
                  <Users className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
                  <span className="text-xs text-green-700 font-medium">{p.africa}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-4">
                  {p.langs.map((l) => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">{l}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground truncate mr-2">{p.badge}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-accent group-hover:underline whitespace-nowrap">
                    Accéder <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="py-20 px-4 bg-primary">
        <ScrollReveal className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <GraduationCap className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-bold text-white">Pensé par des étudiants, pour les étudiants</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-[1.15] mb-5" style={heading}>
            Préparez votre dossier <span className="text-accent">étape par étape</span>
          </h2>
          <p className="text-base text-white/65 leading-relaxed mb-8 max-w-lg mx-auto">
            Campus France, visa, lettre de motivation, logement… nos guides vous accompagnent de la candidature à l'arrivée.
          </p>
          <Link to="/guides"
            className="inline-flex items-center justify-center gap-2 bg-accent text-white font-bold px-7 py-4 rounded-xl hover:opacity-90 transition-opacity text-sm">
            Voir les guides <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-5 mt-8">
            {["Sources officielles", "Gratuit", "Sans inscription"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-white/50">
                <CheckCircle className="w-3.5 h-3.5 text-accent" /> {t}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
