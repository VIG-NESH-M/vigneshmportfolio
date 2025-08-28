import React, { useState } from "react";
import { portfolioData } from "../data/portfolioData";
import { Link } from "../utils/router";
import { useNotifications } from "../hooks/useAppContext";
import { copyToClipboard } from "../utils/clipboard";

export const ContactPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create mailto link with form data
    const subject = encodeURIComponent(
      formData.subject || "Contact from Portfolio"
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:${portfolioData.email}?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success notification
    addNotification({
      type: "success",
      message: "Email client opened! Thank you for reaching out.",
      duration: 5000,
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleCopyEmail = async () => {
    try {
      const success = await copyToClipboard(portfolioData.email);
      if (success) {
        addNotification({
          type: "success",
          message: "Email copied to clipboard!",
          duration: 3000,
        });
      } else {
        addNotification({
          type: "error",
          message: "Failed to copy email",
          duration: 3000,
        });
      }
    } catch {
      addNotification({
        type: "error",
        message: "Failed to copy email",
        duration: 3000,
      });
    }
  };

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
        <div className="terminal-title">contact-vignesh</div>
      </div>

      <main className="section">
        <h1 className="section-title font-sans">Let's Connect</h1>
        <h2 className="section-subtitle">INITIATE_CONTACT</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
            <p className="text-lg leading-relaxed mb-8">
              I'm always excited to discuss new opportunities, innovative
              projects, or just chat about the latest in web development.
              Whether you have a project in mind or want to collaborate, I'd
              love to hear from you!
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-color rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-color-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">Email</h4>
                  <button
                    onClick={handleCopyEmail}
                    className="text-accent-color hover:underline text-lg"
                    title="Click to copy email"
                  >
                    {portfolioData.email}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-color rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-color-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">Location</h4>
                  <p className="text-lg">Available for remote work</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-color rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-color-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">Response Time</h4>
                  <p className="text-lg">Usually within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-header-bg border border-border-color rounded-lg focus:outline-none focus:border-accent-color transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-header-bg border border-border-color rounded-lg focus:outline-none focus:border-accent-color transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-header-bg border border-border-color rounded-lg focus:outline-none focus:border-accent-color transition-colors"
                  placeholder="Project discussion, collaboration, etc."
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-header-bg border border-border-color rounded-lg focus:outline-none focus:border-accent-color transition-colors resize-vertical"
                  placeholder="Tell me about your project or how we can work together..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent-color text-accent-color-dark font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/"
            className="nav-link border border-accent-color text-accent-color px-8 py-3 rounded-lg font-bold hover:bg-accent-color hover:text-accent-color-dark transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </main>
    </div>
  );
};
