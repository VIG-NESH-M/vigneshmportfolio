import React from "react";
import { portfolioData } from "../data/portfolioData";
import { ProjectCard } from "../components/ProjectCard";
import { Link } from "../utils/router";

export const ProjectsPage: React.FC = () => {
  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <span
          className="window-dot"
          style={{ background: "#f87171" }}
          aria-hidden="true"
        ></span>
        <span
          className="window-dot"
          style={{ background: "#fbbd23" }}
          aria-hidden="true"
        ></span>
        <span
          className="window-dot"
          style={{ background: "#34d399" }}
          aria-hidden="true"
        ></span>
        <div className="terminal-title">projects-showcase</div>
      </div>

      <main className="section">
        <h1 className="section-title font-sans">My Projects</h1>
        <h2 className="section-subtitle">SELECTED_WORKS</h2>

        <p className="text-lg md:text-xl max-w-4xl leading-relaxed mb-12">
          A curated collection of projects that showcase my skills, creativity,
          and problem-solving approach. Each project represents a unique
          challenge and demonstrates different aspects of modern web
          development.
        </p>

        <div className="project-grid">
          {portfolioData.projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="section-subtitle justify-center">MORE_COMING_SOON</h3>
          <p className="text-lg mb-8">
            I'm constantly working on new projects and experimenting with
            cutting-edge technologies. Stay tuned for more exciting
            developments!
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="nav-link bg-accent-color text-accent-color-dark px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              ← Back to Home
            </Link>
            <a
              href="https://github.com/vigneshmdev"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link border border-accent-color text-accent-color px-6 py-3 rounded-lg font-bold hover:bg-accent-color hover:text-accent-color-dark transition-colors"
            >
              View GitHub →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
