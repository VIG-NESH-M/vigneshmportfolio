import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Skill } from "../types/portfolioTypes";

type SkillBarProps = Skill;

export const SkillBar: React.FC<SkillBarProps> = ({ name, level, label }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const skillRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
      rootMargin: "0px 0px -100px 0px",
    });

    const currentRef = skillRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleIntersection]);

  // Helper function to get skill description based on name
  const getSkillDescription = (skillName: string): string => {
    const descriptions: { [key: string]: string } = {
      JavaScript: "Modern ES6+ features, async/await, and DOM manipulation",
      React: "Hooks, context, state management, and component architecture",
      "HTML/CSS": "Semantic HTML, CSS Grid/Flexbox, and responsive design",
      "Node.js": "Express.js, RESTful APIs, and server-side development",
      Figma: "UI/UX design, prototyping, and design systems",
      Git: "Version control, branching strategies, and collaboration",
    };

    return (
      descriptions[skillName] || "Proficient in modern development practices"
    );
  };

  return (
    <div
      ref={skillRef}
      className="skill"
      role="region"
      aria-labelledby={`skill-${name.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="skill-header">
        <h3
          id={`skill-${name.replace(/\s+/g, "-").toLowerCase()}`}
          className="skill-name"
        >
          {name}
        </h3>
        <span className="skill-level" aria-label={`Skill level: ${label}`}>
          {label}
        </span>
      </div>

      <div className="skill-content">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {parseInt(level)}%
          </span>
        </div>

        <div
          className="skill-progress"
          role="progressbar"
          aria-valuenow={parseInt(level)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name} proficiency: ${level}`}
        >
          <div
            className="skill-progress-fill"
            style={{
              width: isVisible ? level : "0%",
            }}
          />
        </div>

        <p className="skill-description">{getSkillDescription(name)}</p>
      </div>
    </div>
  );
};
