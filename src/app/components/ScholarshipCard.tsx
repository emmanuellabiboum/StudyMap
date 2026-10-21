import { DollarSign, Clock, ExternalLink, Globe } from "lucide-react";
import { Scholarship, daysLeft, formatDate } from "../../lib/data";

const heading = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function ScholarshipCard({ s, className = "" }: { s: Scholarship; className?: string }) {
  const d = daysLeft(s.deadline_date);
  const closed = d !== null && d < 0;

  return (
    <div className={`bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-shadow flex flex-col ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground"><Globe className="w-3.5 h-3.5" />{s.org}</p>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-accent border border-orange-200 flex-shrink-0 ml-2">
          {s.tag}
        </span>
      </div>

      <h3 className="font-bold text-foreground text-sm mb-1.5 leading-tight" style={heading}>{s.name}</h3>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed flex-1">{s.description}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{s.amount}</span>
        {d !== null && (
          <span className={`flex items-center gap-1 ${closed ? "text-red-600" : ""}`}>
            <Clock className="w-3.5 h-3.5" />
            {closed ? "Clôturée" : `${d} j restants`}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {s.deadline_date ? (
            <>Clôture <strong className="text-foreground">{formatDate(s.deadline_date)}</strong></>
          ) : (
            <>{s.deadline_note ?? "Date à confirmer"}</>
          )}
        </span>
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"
        >
          Site officiel <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
