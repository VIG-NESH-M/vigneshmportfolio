import type { PortfolioData } from "../types/portfolioTypes";

export const portfolioData: PortfolioData = {
  name: "Vignesh M",
  email: "vignezhm@gmail.com",
  aboutTagline: "Pixels, Performance & Possibilities.",
  aboutContent:
    "Hi, I’m a creative full-stack developer fluent in React, Angular, and clean design thinking. I craft lightning-fast frontends and scalable backends with a strong eye for UX and performance. If it runs in the browser, I can make it beautiful, functional, and unforgettable.",
  hero: {
    title: "HELLO. I'M VIGNESH M.",
    yearsExperience: "3+",
    projectsCompleted: "50+",
    technologies: "15+",
  },
  navLinks: [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#toolkit", label: "Toolkit" },
    { href: "#work", label: "Work" },
    { href: "#socials", label: "Socials" },
    { href: "#contact", label: "Contact" },
  ],
  skills: [
    { name: "JavaScript (ES6+)", level: "90%", label: "Expert" },
    { name: "React & Next.js", level: "85%", label: "Advanced" },
    { name: "HTML5 & CSS3", level: "95%", label: "Master" },
    { name: "Node.js & Express", level: "75%", label: "Proficient" },
    { name: "Figma & UI Design", level: "80%", label: "Advanced" },
    { name: "Git & Version Control", level: "90%", label: "Expert" },
  ],
  projects: [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, inventory management, and an admin dashboard.",
      tags: ["React", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
      link: "https://github.com/vigneshmdev", // Replace with actual project URL
    },
    {
      title: "Real-Time Chat Application",
      description:
        "A modern chat application with real-time messaging, file sharing, and video calls. Built using React, Socket.io, and Firebase for real-time data synchronization.",
      tags: ["React", "Socket.io", "Firebase", "WebRTC", "TypeScript"],
      link: "https://github.com/vigneshmdev", // Replace with actual project URL
    },
    {
      title: "Project Management Dashboard",
      description:
        "A comprehensive project management tool with task tracking, team collaboration, and analytics. Features drag-and-drop functionality and real-time updates.",
      tags: ["Angular", "Spring Boot", "MongoDB", "Chart.js", "Material UI"],
      link: "https://github.com/vigneshmdev", // Replace with actual project URL
    },
  ],
  experience: [
    {
      date: "2022 - Present",
      role: "Full Stack Developer",
      company: "Staunch Info Solutions",
      description:
        "Architected and developed scalable enterprise applications using React, Angular, and Spring Boot. Built advanced grid systems, dynamic UI components, and modular data layers to support complex workflows. Collaborated closely with product teams to deliver highly interactive and performant web interfaces tailored for large-scale business use cases.",
    },

    // {
    //   date: "2020 - 2022",
    //   role: "Mid-Level Developer",
    //   company: "Creative Solutions",
    //   description:
    //     "Developed and maintained client-facing websites and applications, focusing on creating pixel-perfect, responsive user interfaces from Figma designs.",
    // },
    // {
    //   date: "2018 - 2020",
    //   role: "Junior Web Developer",
    //   company: "Tech Starters LLC",
    //   description:
    //     "Began my journey by building landing pages and email templates. Learned the fundamentals of web development in a fast-paced agency environment.",
    // },
  ],
  socials: [
    { title: "GitHub", href: "https://github.com/vigneshmdev" }, // Replace with actual GitHub URL
    { title: "LinkedIn", href: "https://linkedin.com/in/vigneshm-dev" }, // Replace with actual LinkedIn URL
    { title: "Instagram", href: "https://instagram.com/vigneshm.dev" }, // Replace with actual Instagram URL
  ],
};
