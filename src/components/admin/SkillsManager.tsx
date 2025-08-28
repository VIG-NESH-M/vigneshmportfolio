import React, { useEffect, useState } from "react";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  type Skill,
} from "../../lib/supabase";

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string;
    level: number;
    label: string;
    sort_order: number;
    is_active: boolean;
  }>({
    name: "",
    level: 0,
    label: "",
    sort_order: 0,
    is_active: true,
  });
  const [editing, setEditing] = useState<Skill | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSkills();
      setSkills(data);
    } catch {
      setError("Failed to load skills");
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
      const payload: {
        name: string;
        level: string;
        label: string;
        sort_order: number;
        is_active: boolean;
      } = {
        name: form.name,
        level: `${form.level}%`,
        label: form.label,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editing) {
        await updateSkill(editing.id, payload);
        setSuccess("Skill updated successfully!");
        setEditing(null);
      } else {
        await createSkill(payload);
        setSuccess("Skill created successfully!");
      }
      setForm({
        name: "",
        level: 0,
        label: "",
        sort_order: 0,
        is_active: true,
      });
      await load();
    } catch {
      setError("Failed to save skill");
    }
  };

  const onEdit = (s: Skill) => {
    setEditing(s);
    const parsed =
      typeof s.level === "string"
        ? parseInt(s.level)
        : (s.level as unknown as number);
    setForm({
      name: s.name,
      level: isNaN(parsed) ? 0 : parsed,
      label: s.label,
      sort_order: s.sort_order,
      is_active: s.is_active,
    });
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteSkill(id);
      setSuccess("Skill deleted successfully!");
      await load();
    } catch {
      setError("Failed to delete skill");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Skills Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your technical skills and proficiency levels
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
          {editing ? "Edit Skill" : "Add New Skill"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Skill Information Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Skill Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., JavaScript, React, Python"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  The name of the technology or skill
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Skill Category/Label
                </label>
                <input
                  type="text"
                  placeholder="e.g., Frontend, Backend, Database"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Category or type of skill (Frontend, Backend, etc.)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lower numbers appear first in skills section
                </p>
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
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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

          {/* Proficiency Level Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Proficiency Level
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Skill Level
                  </label>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {form.level}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: parseInt(e.target.value) })
                    }
                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${form.level}%, #e5e7eb ${form.level}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Beginner (0%)</span>
                    <span>Intermediate (50%)</span>
                    <span>Expert (100%)</span>
                  </div>
                </div>
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {form.level === 0 &&
                      "Select your proficiency level for this skill"}
                    {form.level > 0 &&
                      form.level <= 25 &&
                      "🌱 Beginner - Learning the basics"}
                    {form.level > 25 &&
                      form.level <= 50 &&
                      "📈 Developing - Building confidence"}
                    {form.level > 50 &&
                      form.level <= 75 &&
                      "💪 Proficient - Comfortable and capable"}
                    {form.level > 75 &&
                      form.level <= 90 &&
                      "🚀 Advanced - Highly skilled"}
                    {form.level > 90 && "⭐ Expert - Mastery level"}
                  </p>
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
                    name: "",
                    level: 0,
                    label: "",
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
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
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
              {editing ? "Update Skill" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>

      {/* Skills List */}
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Technical Skills Portfolio
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-green-500"></div>
              <span className="text-sm font-medium">Loading skills…</span>
            </div>
          </div>
        ) : skills.length === 0 ? (
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No skills yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Add your first technical skill using the form above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {skills
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((skill) => {
                const levelNum =
                  typeof skill.level === "string"
                    ? parseInt(skill.level) || 0
                    : (skill.level as unknown as number) || 0;

                return (
                  <div
                    key={skill.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              skill.is_active
                                ? "bg-green-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          ></div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {skill.name}
                            </h4>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                              {skill.label}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              #{skill.sort_order}
                            </span>
                          </div>
                        </div>

                        {/* Skill Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Proficiency Level
                            </span>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              {skill.level}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${levelNum}%` }}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {levelNum <= 25 && "🌱 Beginner"}
                            {levelNum > 25 && levelNum <= 50 && "📈 Developing"}
                            {levelNum > 50 && levelNum <= 75 && "💪 Proficient"}
                            {levelNum > 75 && levelNum <= 90 && "🚀 Advanced"}
                            {levelNum > 90 && "⭐ Expert"}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              skill.is_active
                                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {skill.is_active ? "Active" : "Hidden"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-6 flex-shrink-0">
                        <button
                          onClick={() => onEdit(skill)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                          title="Edit skill"
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
                          onClick={() => onDelete(skill.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                          title="Delete skill"
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
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
