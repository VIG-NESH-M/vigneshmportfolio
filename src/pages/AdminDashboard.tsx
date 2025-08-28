import React, { useState, useEffect } from "react";
import {
  signInAdmin,
  signOut,
  isCurrentUserAdmin,
  getProjects,
  getSkills,
  getContactMessages,
  createProject,
  updateProject,
  deleteProject,
  createSkill,
  updateSkill,
  deleteSkill,
  markMessageAsRead,
  type Project,
  type Skill,
  type ContactMessage,
} from "../lib/supabase";

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("vignezhm@gmail.com");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "projects" | "skills" | "messages"
  >("dashboard");

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Form states
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image_url: "",
    tags: "",
    link: "",
    is_featured: false,
    sort_order: 0,
  });

  const [skillForm, setSkillForm] = useState({
    name: "",
    level: "",
    label: "",
    sort_order: 0,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAdmin = await isCurrentUserAdmin();
        setIsAuthenticated(isAdmin);
        if (isAdmin) {
          await loadData();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, skillsData, messagesData] = await Promise.all([
        getProjects(),
        getSkills(),
        getContactMessages(),
      ]);

      setProjects(projectsData);
      setSkills(skillsData);
      setMessages(messagesData);
    } catch {
      setError("Failed to load data");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await signInAdmin(email, password);
      if (user) {
        const isAdmin = await isCurrentUserAdmin();
        if (isAdmin) {
          setIsAuthenticated(true);
          await loadData();
        } else {
          setError("Not authorized as admin");
        }
      }
    } catch (err) {
      setError("Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setProjects([]);
      setSkills([]);
      setMessages([]);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Project CRUD operations
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = projectForm.tags
        .split(",")
        .map((tag: string) => tag.trim());
      const success = await createProject({
        ...projectForm,
        tags: tagsArray,
        is_active: true,
      });

      if (success) {
        await loadData();
        setShowProjectForm(false);
        setProjectForm({
          title: "",
          description: "",
          image_url: "",
          tags: "",
          link: "",
          is_featured: false,
          sort_order: 0,
        });
      }
    } catch {
      setError("Failed to create project");
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const tagsArray = projectForm.tags
        .split(",")
        .map((tag: string) => tag.trim());
      const success = await updateProject(editingProject.id, {
        ...projectForm,
        tags: tagsArray,
      });

      if (success) {
        await loadData();
        setEditingProject(null);
        setProjectForm({
          title: "",
          description: "",
          image_url: "",
          tags: "",
          link: "",
          is_featured: false,
          sort_order: 0,
        });
      }
    } catch {
      setError("Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const success = await deleteProject(projectId);
        if (success) {
          await loadData();
        }
      } catch {
        setError("Failed to delete project");
      }
    }
  };

  const startEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      image_url: project.image_url || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
      link: project.link || "",
      is_featured: project.is_featured,
      sort_order: project.sort_order,
    });
  };

  // Skill CRUD operations
  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await createSkill({
        ...skillForm,
        is_active: true,
      });
      if (success) {
        await loadData();
        setShowSkillForm(false);
        setSkillForm({ name: "", level: "", label: "", sort_order: 0 });
      }
    } catch {
      setError("Failed to create skill");
    }
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      const success = await updateSkill(editingSkill.id, skillForm);
      if (success) {
        await loadData();
        setEditingSkill(null);
        setSkillForm({ name: "", level: "", label: "", sort_order: 0 });
      }
    } catch {
      setError("Failed to update skill");
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        const success = await deleteSkill(skillId);
        if (success) {
          await loadData();
        }
      } catch {
        setError("Failed to delete skill");
      }
    }
  };

  const startEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      level: skill.level,
      label: skill.label,
      sort_order: skill.sort_order,
    });
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
      await loadData();
    } catch {
      setError("Failed to mark message as read");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Portfolio Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {["dashboard", "projects", "skills", "messages"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(
                    tab as "dashboard" | "projects" | "skills" | "messages"
                  )
                }
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {activeTab === "dashboard" && (
          <div>
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              🎉 <strong>Success!</strong> Full CRUD Admin dashboard is ready!
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-bold text-blue-600">
                        {projects.length}
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Projects
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-bold text-green-600">
                        {skills.length}
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Skills
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-bold text-orange-600">
                        {messages.length}
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Messages
                        </dt>
                        <dd className="text-xs text-gray-400">
                          {messages.filter((m) => !m.is_read).length} unread
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Messages
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Latest contact form submissions
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {messages.slice(0, 5).map((message) => (
                  <li key={message.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {message.name}
                        </p>
                        <p className="text-sm text-gray-500">{message.email}</p>
                        <p className="text-sm text-gray-700 mt-1">
                          {message.message.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex items-center">
                        {!message.is_read && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Projects Management
              </h2>
              <button
                onClick={() => setShowProjectForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Project
              </button>
            </div>

            {(showProjectForm || editingProject) && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h3>
                <form
                  onSubmit={
                    editingProject ? handleUpdateProject : handleCreateProject
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            title: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={projectForm.image_url}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            image_url: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={projectForm.tags}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            tags: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="React, TypeScript, Node.js"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Project Link
                      </label>
                      <input
                        type="url"
                        value={projectForm.link}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            link: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={projectForm.sort_order}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            sort_order: parseInt(e.target.value),
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={projectForm.is_featured}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            is_featured: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Featured Project
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingProject ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProjectForm(false);
                        setEditingProject(null);
                        setProjectForm({
                          title: "",
                          description: "",
                          image_url: "",
                          tags: "",
                          link: "",
                          is_featured: false,
                          sort_order: 0,
                        });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <li key={project.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {Array.isArray(project.tags) &&
                            project.tags.map((tag: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        {project.is_featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditProject(project)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Skills Management
              </h2>
              <button
                onClick={() => setShowSkillForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add New Skill
              </button>
            </div>

            {(showSkillForm || editingSkill) && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {editingSkill ? "Edit Skill" : "Add New Skill"}
                </h3>
                <form
                  onSubmit={
                    editingSkill ? handleUpdateSkill : handleCreateSkill
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={skillForm.name}
                        onChange={(e) =>
                          setSkillForm({ ...skillForm, name: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Level
                      </label>
                      <select
                        value={skillForm.level}
                        onChange={(e) =>
                          setSkillForm({ ...skillForm, level: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Label
                      </label>
                      <input
                        type="text"
                        value={skillForm.label}
                        onChange={(e) =>
                          setSkillForm({ ...skillForm, label: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={skillForm.sort_order}
                        onChange={(e) =>
                          setSkillForm({
                            ...skillForm,
                            sort_order: parseInt(e.target.value),
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      {editingSkill ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSkillForm(false);
                        setEditingSkill(null);
                        setSkillForm({
                          name: "",
                          level: "",
                          label: "",
                          sort_order: 0,
                        });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {skills.map((skill) => (
                  <li key={skill.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {skill.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Level: {skill.level}
                        </p>
                        <p className="text-sm text-gray-500">
                          Label: {skill.label}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditSkill(skill)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Messages Management
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <li key={message.id} className="px-4 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {message.name}
                          </h3>
                          {!message.is_read && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{message.email}</p>
                        <p className="text-sm text-gray-700 mt-2">
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {!message.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(message.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
