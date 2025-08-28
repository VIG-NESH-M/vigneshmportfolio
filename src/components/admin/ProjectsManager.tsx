import React, { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from "../../lib/supabase";

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    image_url: string;
    tags: string;
    link: string;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
  }>({
    title: "",
    description: "",
    image_url: "",
    tags: "",
    link: "",
    is_featured: false,
    is_active: true,
    sort_order: 0,
  });
  const [editing, setEditing] = useState<Project | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toTagsArray = (tags: string) =>
    tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      const now = new Date().toISOString();
      const payload: Omit<Project, "id"> = {
        ...form,
        tags: toTagsArray(form.tags),
        created_at: editing?.created_at ?? now,
        updated_at: now,
      };
      if (editing) {
        await updateProject(editing.id, payload);
        setSuccess("Project updated successfully!");
        setEditing(null);
      } else {
        await createProject(payload);
        setSuccess("Project created successfully!");
      }
      setForm({
        title: "",
        description: "",
        image_url: "",
        tags: "",
        link: "",
        is_featured: false,
        is_active: true,
        sort_order: 0,
      });
      await load();
    } catch {
      setError("Failed to save project");
    }
  };

  const onEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      image_url: p.image_url || "",
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
      link: p.link || "",
      is_featured: p.is_featured,
      is_active: p.is_active,
      sort_order: p.sort_order,
    });
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteProject(id);
      setSuccess("Project deleted successfully!");
      await load();
    } catch {
      setError("Failed to delete project");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Projects Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your portfolio projects and showcase your work
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-400">
                Error
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-400">
                Success
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                {success}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                editing
                  ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  : "M12 6v6m0 0v6m0-6h6m-6 0H6"
              }
            />
          </svg>
          {editing ? "Edit Project" : "Add New Project"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Project Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., E-commerce Website, Mobile App"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  The name of your project
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Order
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lower numbers appear first (0 = featured)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Description
              </label>
              <textarea
                placeholder="Describe your project, its features, technologies used, and achievements..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Detailed description of your project and its key features
              </p>
            </div>
          </div>

          {/* Media & Links Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Media & Links
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/project-image.jpg"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  URL to a screenshot or preview image of your project
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Link
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project or https://project-demo.com"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Link to live demo, GitHub repository, or project page
                </p>
              </div>
            </div>
          </div>

          {/* Technologies Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Technologies & Tags
            </h4>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Technology Tags
              </label>
              <input
                type="text"
                placeholder="React, TypeScript, Node.js, MongoDB, AWS"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Comma-separated list of technologies, frameworks, and tools used
              </p>
            </div>
          </div>

          {/* Project Settings Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Project Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured Project
                </label>
                <div className="flex items-center h-12 px-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) =>
                        setForm({ ...form, is_featured: e.target.checked })
                      }
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Featured{" "}
                      {form.is_featured
                        ? "(Highlighted in portfolio)"
                        : "(Regular project)"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Visibility Status
                </label>
                <div className="flex items-center h-12 px-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm({ ...form, is_active: e.target.checked })
                      }
                      className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active{" "}
                      {form.is_active
                        ? "(Visible on portfolio)"
                        : "(Hidden from portfolio)"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    title: "",
                    description: "",
                    image_url: "",
                    tags: "",
                    link: "",
                    is_featured: false,
                    is_active: true,
                    sort_order: 0,
                  });
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={editing ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}
                />
              </svg>
              {editing ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Portfolio Projects
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-cyan-500"></div>
              <span className="text-sm font-medium">Loading projects…</span>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Add your first project using the form above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            project.is_active
                              ? "bg-cyan-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        ></div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {project.title}
                          </h4>
                          {project.is_featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                              ⭐ Featured
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            #{project.sort_order}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                        {project.description}
                      </p>

                      {/* Tags */}
                      {Array.isArray(project.tags) &&
                        project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tags.map((tag, index) => (
                              <span
                                key={`${project.id}-tag-${index}`}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                      {/* Links and Status */}
                      <div className="flex items-center gap-4 text-xs">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline flex items-center gap-1"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            View Project
                          </a>
                        )}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${
                            project.is_active
                              ? "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {project.is_active ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-6 flex-shrink-0">
                      <button
                        onClick={() => onEdit(project)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        title="Edit project"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(project.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        title="Delete project"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;
