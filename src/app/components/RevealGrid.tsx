import { Children, useEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const PAGE_SIZE = 9;

type RevealGridProps = {
  children: ReactNode;
  className: string;
  resetKey: string;
};

export default function RevealGrid({ children, className, resetKey }: RevealGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const items = Children.toArray(children);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [resetKey]);

  return (
    <>
      <div className={className}>
        {items.slice(0, visibleCount).map((item, index) => (
          <ScrollReveal key={index} delay={(index % PAGE_SIZE) * 45}>
            {item}
          </ScrollReveal>
        ))}
      </div>
      {items.length > visibleCount && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            Voir plus ({items.length - visibleCount})
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}