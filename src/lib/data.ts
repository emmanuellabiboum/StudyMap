import scholarshipsRaw from "../../data/scholarships.json";
import guidesRaw from "../../data/guides.json";
import universitiesRaw from "../../data/universities.json";
import portalsRaw from "../../data/portals.json";

export interface Scholarship {
  id: string;
  name: string;
  org: string;
  country: string;
  amount: string;
  tag: string;
  url: string;
  description: string;
  deadline_date: string | null;
  deadline_note: string | null;
  last_checked: string | null;
  link_ok: boolean | null;
  source: string;
  review?: "pending";
}

export interface GuideSection {
  title: string;
  text: string;
  link?: { label: string; url: string };
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  country: string | null;
  read_time: string;
  icon_type: string;
  intro: string;
  sections: GuideSection[];
  tip: string | null;
  level: string | null;
  profile: string | null;
  tags: string[];
  useful_links: { label: string; url: string }[];
  featured: boolean;
}

export interface University {
  id: string;
  name: string;
  fullName: string;
  country: string;
  city: string;
  ranking: string;
  type: string;
  cost: string;
  programs: string[];
  access: string;
  scholarship: string;
  languages: string[];
  admissionUrl: string;
  description: string;
  tags: string[];
}

export interface Portal {
  name: string;
  desc: string;
  country: string;
  url: string;
  badge: string;
  tag: string;
  langs: string[];
  africa: string;
}

export const guides = guidesRaw as Guide[];
export const universities = universitiesRaw as University[];
export const portals = portalsRaw as Portal[];

export function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const end = new Date(deadline + "T23:59:59");
  return Math.ceil((end.getTime() - Date.now()) / 86_400_000);
}

export function formatDate(deadline: string): string {
  return new Date(deadline + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export const scholarships: Scholarship[] = (scholarshipsRaw as Scholarship[])
  .filter((s) => s.review !== "pending")
  .sort((a, b) => rank(a) - rank(b) || (a.deadline_date ?? "").localeCompare(b.deadline_date ?? ""));

function rank(s: Scholarship): number {
  const d = daysLeft(s.deadline_date);
  if (d === null) return 1;
  return d >= 0 ? 0 : 2;
}
