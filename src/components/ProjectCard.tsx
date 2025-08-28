import React from "react";
import type { Project } from "../types/portfolioTypes";

type ProjectCardProps = Project;

// Technology configurations with colors only - clean and simple
const techConfig: Record<
  string,
  {
    color: string;
    bg: string;
  }
> = {
  React: {
    color: "#61DAFB",
    bg: "rgba(97, 218, 251, 0.1)",
  },
  "Node.js": {
    color: "#339933",
    bg: "rgba(51, 153, 51, 0.1)",
  },
  PostgreSQL: {
    color: "#4169E1",
    bg: "rgba(65, 105, 225, 0.1)",
  },
  Stripe: {
    color: "#6772E5",
    bg: "rgba(103, 114, 229, 0.1)",
  },
  "Tailwind CSS": {
    color: "#06B6D4",
    bg: "rgba(6, 182, 212, 0.1)",
  },
  "Socket.io": {
    color: "#25c2a0",
    bg: "rgba(37, 194, 160, 0.1)",
  },
  Firebase: {
    color: "#FFCA28",
    bg: "rgba(255, 202, 40, 0.1)",
  },
  WebRTC: {
    color: "#FF6B6B",
    bg: "rgba(255, 107, 107, 0.1)",
  },
  TypeScript: {
    color: "#3178C6",
    bg: "rgba(49, 120, 198, 0.1)",
  },
  Angular: {
    color: "#DD0031",
    bg: "rgba(221, 0, 49, 0.1)",
  },
  "Spring Boot": {
    color: "#6DB33F",
    bg: "rgba(109, 179, 63, 0.1)",
  },
  MongoDB: {
    color: "#47A248",
    bg: "rgba(71, 162, 72, 0.1)",
  },
  "Chart.js": {
    color: "#FF6384",
    bg: "rgba(255, 99, 132, 0.1)",
  },
  "Material UI": {
    color: "#0081CB",
    bg: "rgba(0, 129, 203, 0.1)",
  },
};

const TechTag: React.FC<{ tag: string }> = ({ tag }) => {
  const config = techConfig[tag] || {
    color: "#6B7280",
    bg: "rgba(107, 116, 128, 0.1)",
  };

  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 hover:shadow-sm"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: config.color + "30",
      }}
      role="listitem"
      aria-label={`Technology: ${tag}`}
    >
      <span className="leading-none font-semibold">{tag}</span>
    </span>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  link,
}) => (
  <article className="project-card">
    <div className="project-header" role="presentation">
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
    </div>
    <div className="project-content">
      <h4 className="project-title">{title}</h4>
      <p className="project-description">{description}</p>
      <div
        className="flex flex-wrap gap-2 mb-6"
        role="list"
        aria-label="Technologies used"
      >
        {tags.map((tag) => (
          <TechTag key={tag} tag={tag} />
        ))}
      </div>
      <a
        href={link}
        className="project-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${title} project (opens in new tab)`}
      >
        View Project{" "}
        <span className="arrow" aria-hidden="true">
          -&gt;
        </span>
      </a>
    </div>
  </article>
);
