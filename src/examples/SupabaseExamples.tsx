import React, { useState, useEffect } from "react";
import {
  getProjects,
  getFeaturedProjects,
  signInAdmin,
  signOut,
  getCurrentSession,
  isCurrentUserAdmin,
  createProject,
  updateProject,
  deleteProject,
  submitContactMessage,
  getContactMessages,
  subscribeToProjects,
  type Project,
  type ContactMessage,
} from "../lib/supabase";

/**
 * Example React component demonstrating Supabase integration
 * This shows both public and admin functionality
 */
export const SupabaseExamples: React.FC = () => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin login form
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // New project form
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: "",
    link: "",
    sort_order: 0,
    is_featured: false,
    is_active: true,
  });

  // Contact form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // =============================================================================
  // EFFECTS
  // =============================================================================
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const [projectsData, featuredProjectsData] = await Promise.all([
          getProjects(),
          getFeaturedProjects(),
        ]);

        setProjects(projectsData);
        console.log("Featured projects:", featuredProjectsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      try {
        await getCurrentSession();
        const adminStatus = await isCurrentUserAdmin();
        setIsAdmin(adminStatus);

        if (adminStatus) {
          loadContactMessages();
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    };

    initializeData();
    checkAdminStatus();
  }, []);

  useEffect(() => {
    // Subscribe to real-time project updates
    const unsubscribe = subscribeToProjects((updatedProjects) => {
      setProjects(updatedProjects);
    });

    return unsubscribe;
  }, []);

  // =============================================================================
  // INITIALIZATION FUNCTIONS
  // =============================================================================
  const loadContactMessages = async () => {
    try {
      const messages = await getContactMessages();
      setContactMessages(messages);
    } catch (err) {
      console.error("Error loading contact messages:", err);
    }
  };

  // =============================================================================
  // AUTHENTICATION FUNCTIONS
  // =============================================================================
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInAdmin(adminEmail, adminPassword);
      setIsAdmin(true);
      setAdminEmail("");
      setAdminPassword("");
      await loadContactMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAdmin(false);
      setContactMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
    }
  };

  // =============================================================================
  // PROJECT MANAGEMENT FUNCTIONS
  // =============================================================================
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    setIsLoading(true);
    setError(null);

    try {
      const projectData = {
        ...newProject,
        tags: newProject.tags.split(",").map((tag) => tag.trim()),
      };

      const created = await createProject(projectData);
      if (created) {
        setNewProject({
          title: "",
          description: "",
          tags: "",
          link: "",
          sort_order: 0,
          is_featured: false,
          is_active: true,
        });
        // Projects will be updated via real-time subscription
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (
    projectId: string,
    updates: Partial<Project>
  ) => {
    if (!isAdmin) return;

    try {
      await updateProject(projectId, updates);
      // Projects will be updated via real-time subscription
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!isAdmin || !confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await deleteProject(projectId);
      // Projects will be updated via real-time subscription
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  // =============================================================================
  // CONTACT FORM FUNCTIONS
  // =============================================================================
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await submitContactMessage(
        contactForm.name,
        contactForm.email,
        contactForm.subject || undefined,
        contactForm.message
      );

      if (success) {
        setContactForm({ name: "", email: "", subject: "", message: "" });
        alert("Message sent successfully!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Supabase Integration Examples</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Authentication Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>

        {!isAdmin ? (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <h3 className="text-lg font-medium">Admin Login</h3>
            <input
              type="email"
              placeholder="Admin Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In as Admin"}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-green-600 mb-4">✅ Signed in as admin</p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        )}
      </section>

      {/* Public Projects Display */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Projects (Public Access)
        </h2>
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{project.title}</h3>
                  <p className="text-gray-600 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Project
                    </a>
                  )}
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateProject(project.id, {
                          is_featured: !project.is_featured,
                        })
                      }
                      className={`px-2 py-1 rounded text-xs ${
                        project.is_featured
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {project.is_featured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Project Creation */}
      {isAdmin && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Create New Project (Admin Only)
          </h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newProject.tags}
              onChange={(e) =>
                setNewProject({ ...newProject, tags: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="url"
              placeholder="Project Link (optional)"
              value={newProject.link}
              onChange={(e) =>
                setNewProject({ ...newProject, link: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newProject.is_featured}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      is_featured: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Featured Project
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </form>
        </section>
      )}

      {/* Public Contact Form */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Contact Form (Public Access)
        </h2>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={contactForm.name}
            onChange={(e) =>
              setContactForm({ ...contactForm, name: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={contactForm.email}
            onChange={(e) =>
              setContactForm({ ...contactForm, email: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Subject (optional)"
            value={contactForm.subject}
            onChange={(e) =>
              setContactForm({ ...contactForm, subject: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Your Message"
            value={contactForm.message}
            onChange={(e) =>
              setContactForm({ ...contactForm, message: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      {/* Admin Contact Messages */}
      {isAdmin && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Contact Messages (Admin Only)
          </h2>
          <div className="space-y-4">
            {contactMessages.map((message) => (
              <div key={message.id} className="border p-4 rounded">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">
                    {message.name} - {message.email}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      message.is_read
                        ? "bg-gray-200 text-gray-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {message.is_read ? "Read" : "New"}
                  </span>
                </div>
                {message.subject && (
                  <p className="font-medium mb-2">Subject: {message.subject}</p>
                )}
                <p className="text-gray-700 mb-2">{message.message}</p>
                <p className="text-xs text-gray-500">
                  Received: {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SupabaseExamples;
