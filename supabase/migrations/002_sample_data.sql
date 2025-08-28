-- =============================================================================
-- SAMPLE DATA MIGRATION
-- =============================================================================
-- This migration populates the database with sample portfolio data
-- Run this after the initial schema migration
-- =============================================================================

-- Insert admin user (replace with your actual email)
-- Note: You must create this user in Supabase Auth first
insert into public.admin_users (email, is_active) values
('vignezhm@gmail.com', true);

-- Insert portfolio configuration
insert into public.portfolio_config (
  name, 
  email, 
  about_tagline, 
  about_content, 
  hero_title
) values (
  'Vignesh M',
  'vignezhm@gmail.com',
  'Pixels, Performance & Possibilities.',
  'Hi, I''m a creative full-stack developer fluent in React, Angular, and clean design thinking. I craft lightning-fast frontends and scalable backends with a strong eye for UX and performance. If it runs in the browser, I can make it beautiful, functional, and unforgettable.',
  'HELLO. I''M VIGNESH M.'
);

-- Insert navigation links
insert into public.nav_links (href, label, sort_order) values
('#about', 'About', 1),
('#experience', 'Experience', 2),
('#toolkit', 'Toolkit', 3),
('#work', 'Work', 4),
('#socials', 'Socials', 5),
('#contact', 'Contact', 6);

-- Insert skills
insert into public.skills (name, level, label, sort_order) values
('JavaScript (ES6+)', '90%', 'Expert', 1),
('React & Next.js', '85%', 'Advanced', 2),
('HTML5 & CSS3', '95%', 'Master', 3),
('Node.js & Express', '75%', 'Proficient', 4),
('Figma & UI Design', '80%', 'Advanced', 5),
('Git & Version Control', '90%', 'Expert', 6);

-- Insert projects
insert into public.projects (title, description, tags, link, sort_order, is_featured) values
(
  'E-Commerce Platform',
  'A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, inventory management, and an admin dashboard.',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
  'https://github.com/vigneshmdev',
  1,
  true
),
(
  'Real-Time Chat Application',
  'A modern chat application with real-time messaging, file sharing, and video calls. Built using React, Socket.io, and Firebase for real-time data synchronization.',
  ARRAY['React', 'Socket.io', 'Firebase', 'WebRTC', 'TypeScript'],
  'https://github.com/vigneshmdev',
  2,
  true
),
(
  'Project Management Dashboard',
  'A comprehensive project management tool with task tracking, team collaboration, and analytics. Features drag-and-drop functionality and real-time updates.',
  ARRAY['Angular', 'Spring Boot', 'MongoDB', 'Chart.js', 'Material UI'],
  'https://github.com/vigneshmdev',
  3,
  false
);

-- Insert experience
insert into public.experience (date_range, role, company, description, sort_order) values
(
  '2022 - Present',
  'Full Stack Developer',
  'Staunch Info Solutions',
  'Architected and developed scalable enterprise applications using React, Angular, and Spring Boot. Built advanced grid systems, dynamic UI components, and modular data layers to support complex workflows. Collaborated closely with product teams to deliver highly interactive and performant web interfaces tailored for large-scale business use cases.',
  1
);

-- Insert social links
insert into public.social_links (title, href, icon_name, sort_order) values
('GitHub', 'https://github.com/vigneshmdev', 'github', 1),
('LinkedIn', 'https://linkedin.com/in/vigneshm-dev', 'linkedin', 2),
('Instagram', 'https://instagram.com/vigneshm.dev', 'instagram', 3);

-- Get the user ID first
SELECT id, email FROM auth.users WHERE email = 'vignezhm@gmail.com';

-- Insert into admin_users (replace USER_ID with the actual ID from above)
INSERT INTO admin_users (user_id, email, created_at)
VALUES ('19251349-ed3a-4125-863a-9509779627af', 'vignezhm@gmail.com', NOW());