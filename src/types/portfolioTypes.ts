// src/types/portfolio.ts
export interface NavLink {
  href: string;
  label: string;
}

export interface Skill {
  name: string;
  level: string;
  label: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export interface Experience {
  date: string;
  role: string;
  company: string;
  description: string;
}

export interface Social {
  title: string;
  href: string;
}

export interface Hero {
  title: string;
  yearsExperience: string;
  projectsCompleted: string;
  technologies: string;
}

export interface PortfolioData {
  name: string;
  email: string;
  aboutTagline: string;
  aboutContent: string;
  hero: Hero;
  navLinks: NavLink[];
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  socials: Social[];
}

export type Theme = "dark" | "light";

export type SectionId =
  | "home"
  | "about"
  | "experience"
  | "toolkit"
  | "work"
  | "socials"
  | "contact";
