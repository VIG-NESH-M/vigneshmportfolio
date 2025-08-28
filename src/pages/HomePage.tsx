import React from "react";
import { portfolioData } from "../data/portfolioData";
import { socialIcons } from "../components/icons/SocialIcons";
import { ProjectCard } from "../components/ProjectCard";
import { SocialLink } from "../components/SocialLink";
import { SkillBar } from "../components/SkillBar";

export const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <header id="home" className="hero-text-container">
        <h1 className="hero-text">{portfolioData.hero.title}</h1>
        <div className="scroll-down">
          <span>INITIATE SCROLL</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </header>

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
          <div className="terminal-title">
            {portfolioData.name.toLowerCase().replace(" ", "-")}-portfolio
          </div>
        </div>

        <main id="main-content" role="main">
          {/* About Section */}
          <section id="about" className="section">
            <h2 className="section-subtitle">01_ABOUT_ME</h2>
            <h3 className="section-title font-sans">
              {portfolioData.aboutTagline}
            </h3>
            <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
              {portfolioData.aboutContent}
            </p>
          </section>

          {/* Experience Section */}
          <section id="experience" className="section">
            <h2 className="section-subtitle">02_CAREER_PATH</h2>
            <h3 className="section-title font-sans">
              Where I've left my digital footprint.
            </h3>
            <div className="experience-timeline">
              {portfolioData.experience.map((item) => (
                <div className="experience-item" key={item.company}>
                  <div className="experience-date">{item.date}</div>
                  <h4 className="experience-role">
                    {item.role} @{" "}
                    <span className="experience-company">{item.company}</span>
                  </h4>
                  <p className="experience-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Toolkit Section */}
          <section id="toolkit" className="section">
            <h2 className="section-subtitle">03_TOOLKIT</h2>
            <h3 className="section-title font-sans">My digital arsenal.</h3>
            <div className="toolkit-grid">
              {portfolioData.skills.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section id="work" className="section">
            <h2 className="section-subtitle">04_SELECTED_LOGS</h2>
            <h3 className="section-title font-sans">
              Missions I've completed.
            </h3>
            <div className="project-grid">
              {portfolioData.projects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </section>

          {/* Socials Section */}
          <section id="socials" className="section text-center">
            <h2 className="section-subtitle justify-center">05_SOCIALS</h2>
            <h3 className="section-title font-sans">Find me on the grid.</h3>
            <div className="social-links-grid">
              {portfolioData.socials.map((social) => {
                const IconComponent = socialIcons[social.title];
                return (
                  <SocialLink
                    key={social.title}
                    href={social.href}
                    title={social.title}
                  >
                    {IconComponent && <IconComponent />}
                  </SocialLink>
                );
              })}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="section text-center">
            <h2 className="section-subtitle justify-center">06_CONTACT</h2>
            <h3 className="section-title font-sans">Let's build the future.</h3>
            <a href={`mailto:${portfolioData.email}`} className="contact-link">
              {portfolioData.email}
            </a>
          </section>
        </main>
      </div>
    </>
  );
};
