import React, { useEffect, useState } from "react";
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  type Experience,
} from "../../lib/supabase";

export const ExperienceManager: React.FC = () => {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<{
    date_range: string;
    role: string;
    company: string;
    description: string;
    sort_order: number;
    is_active: boolean;
  }>({
    date_range: "",
    role: "",
    company: "",
    description: "",
    sort_order: 0,
    is_active: true,
  });
  const [editing, setEditing] = useState<Experience | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExperience();
      setItems(data);
    } catch {
      setError("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      if (editing) {
        await updateExperience(editing.id, form);
        setSuccess("Experience updated successfully!");
        setEditing(null);
      } else {
        await createExperience(form);
        setSuccess("Experience created successfully!");
      }
      setForm({
        date_range: "",
        role: "",
        company: "",
        description: "",
        sort_order: 0,
        is_active: true,
      });
      await load();
    } catch {
      setError("Failed to save experience");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteExperience(id);
      setSuccess("Experience deleted successfully!");
      await load();
    } catch {
      setError("Failed to delete experience");
    }
  };

  const onEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      date_range: exp.date_range,
      role: exp.role,
      company: exp.company,
      description: exp.description,
      sort_order: exp.sort_order,
      is_active: exp.is_active,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.894m-4 0L12 18l-4-1.106M8 4v2a2 2 0 002 2h4a2 2 0 002-2V4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Experience Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your professional work experience and career history
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
          {editing ? "Edit Experience" : "Add New Experience"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your position or job title at the company
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Name of the company or organization
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Range
                </label>
                <input
                  type="text"
                  placeholder="e.g., Jan 2020 - Present, 2019 - 2021"
                  value={form.date_range}
                  onChange={(e) =>
                    setForm({ ...form, date_range: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Duration of employment (start - end dates)
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
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lower numbers appear first (0 = most recent)
                </p>
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Job Description & Achievements
            </h4>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                placeholder="Describe your responsibilities, achievements, and key contributions..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Detailed description of your role, responsibilities, and key
                achievements
              </p>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Visibility Settings
            </h4>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <div className="flex items-center h-12 px-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    date_range: "",
                    role: "",
                    company: "",
                    description: "",
                    sort_order: 0,
                    is_active: true,
                  });
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
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
              {editing ? "Update Experience" : "Add Experience"}
            </button>
          </div>
        </form>
      </div>

      {/* Experience List */}
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
              d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Work Experience Timeline
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-purple-500"></div>
              <span className="text-sm font-medium">
                Loading experience data…
              </span>
            </div>
          </div>
        ) : items.length === 0 ? (
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.894m-4 0L12 18l-4-1.106M8 4v2a2 2 0 002 2h4a2 2 0 002-2V4"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No experience entries yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Add your first work experience using the form above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            exp.is_active
                              ? "bg-purple-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        ></div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {exp.role}
                          </h4>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {exp.company}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            #{exp.sort_order}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {exp.date_range}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            exp.is_active
                              ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {exp.is_active ? "Active" : "Hidden"}
                        </span>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-6 flex-shrink-0">
                      <button
                        onClick={() => onEdit(exp)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        title="Edit experience"
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
                        onClick={() => onDelete(exp.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        title="Delete experience"
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

export default ExperienceManager;
