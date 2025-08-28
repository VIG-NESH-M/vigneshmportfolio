import { useState, useEffect } from "react";
import {
  getPortfolioConfig,
  getNavLinks,
  getSkills,
  getProjects,
  getExperience,
  getSocialLinks,
  type Project,
} from "../lib/supabase";
import type { PortfolioData } from "../types/portfolioTypes";

/**
 * Custom hook to fetch all portfolio data from Supabase
 * Returns data in the same format as your existing portfolioData
 */
export function useSupabasePortfolio() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolioData();

    // Refresh data every 30 seconds to pick up config changes
    const interval = setInterval(loadPortfolioData, 30000);

    // Refresh data when the window gains focus (useful when switching from admin)
    const handleFocus = () => {
      loadPortfolioData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const loadPortfolioData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [config, navLinks, skills, projects, experience, socialLinks] =
        await Promise.all([
          getPortfolioConfig(),
          getNavLinks(),
          getSkills(),
          getProjects(),
          getExperience(),
          getSocialLinks(),
        ]);

      if (!config) {
        throw new Error("Portfolio configuration not found");
      }

      // Transform Supabase data to match your existing PortfolioData interface
      const portfolioData: PortfolioData = {
        name: config.name,
        email: config.email,
        aboutTagline: config.about_tagline,
        aboutContent: config.about_content,
        hero: {
          title: config.hero_title,
          yearsExperience: config.hero_years_experience || "3+",
          projectsCompleted: config.hero_projects_completed || "50+",
          technologies: config.hero_technologies || "15+",
        },
        navLinks: navLinks.map((link) => ({
          href: link.href,
          label: link.label,
        })),
        skills: skills.map((skill) => ({
          name: skill.name,
          level: skill.level,
          label: skill.label,
        })),
        projects: projects.map((project) => ({
          title: project.title,
          description: project.description,
          tags: project.tags,
          link: project.link || "",
        })),
        experience: experience.map((exp) => ({
          date: exp.date_range,
          role: exp.role,
          company: exp.company,
          description: exp.description,
        })),
        socials: socialLinks.map((social) => ({
          title: social.title,
          href: social.href,
        })),
      };

      setData(portfolioData);
    } catch (err) {
      console.error("Error loading portfolio data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load portfolio data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch: loadPortfolioData };
}

/**
 * Hook for fetching only projects (useful for project pages)
 */
export function useSupabaseProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  return { projects, isLoading, error, refetch: loadProjects };
}
