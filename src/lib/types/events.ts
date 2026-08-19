export type CompanyEventStatus = "upcoming" | "past";

export interface CompanyEvent {
  id: string;
  title: string;
  summary: string;
  date: string;
  location: string;
  status: CompanyEventStatus;
  format: string;
  image: string;
  imageAlt: string;
  focus: string[];
}

export interface EventActivity {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}
