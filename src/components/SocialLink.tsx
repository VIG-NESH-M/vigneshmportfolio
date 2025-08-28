import React, { type ReactNode } from "react";

interface SocialLinkProps {
  href: string;
  title: string;
  children: ReactNode;
  platform?: string;
}

export const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  title,
  children,
  platform,
}) => (
  <a
    href={href}
    className={`social-link ${
      platform ? `social-link-${platform.toLowerCase()}` : ""
    }`}
    title={title}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Visit my ${title} profile`}
  >
    <div className="social-link-content">
      <div className="social-link-icon">{children}</div>
    </div>
  </a>
);
