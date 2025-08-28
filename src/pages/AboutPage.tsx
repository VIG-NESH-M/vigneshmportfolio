import React from "react";
import { portfolioData } from "../data/portfolioData";
import { Link } from "../utils/router";

export const AboutPage: React.FC = () => {
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
        <div className="terminal-title">about-vignesh-m</div>
      </div>

      <main className="section">
        <h1 className="section-title font-sans">About Me</h1>

        <div className="max-w-4xl">
          <h2 className="section-subtitle">01_INTRODUCTION</h2>
          <p className="text-lg leading-relaxed mb-8">
            {portfolioData.aboutContent}
          </p>

          <h2 className="section-subtitle">02_PHILOSOPHY</h2>
          <p className="text-lg leading-relaxed mb-8">
            I believe in writing clean, maintainable code that not only solves
            problems but also tells a story. Every line of code is an
            opportunity to make the digital world a little bit better, a little
            bit faster, and a little bit more beautiful.
          </p>

          <h2 className="section-subtitle">03_APPROACH</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-accent-color">
                Frontend Excellence
              </h3>
              <ul className="space-y-2 text-lg">
                <li>• Pixel-perfect responsive designs</li>
                <li>• Performance-first development</li>
                <li>• Accessibility-driven approach</li>
                <li>• Modern React patterns</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-accent-color">
                Backend Mastery
              </h3>
              <ul className="space-y-2 text-lg">
                <li>• Scalable API architecture</li>
                <li>• Database optimization</li>
                <li>• Security best practices</li>
                <li>• Cloud-native solutions</li>
              </ul>
            </div>
          </div>

          <h2 className="section-subtitle">04_JOURNEY</h2>
          <p className="text-lg leading-relaxed mb-8">
            My journey in web development started with curiosity and has evolved
            into a passion for creating exceptional digital experiences. From
            building my first static website to architecting complex enterprise
            applications, every project has been a stepping stone in my
            continuous learning journey.
          </p>

          <div className="flex justify-center">
            <Link
              to="/"
              className="nav-link bg-accent-color text-accent-color-dark px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
