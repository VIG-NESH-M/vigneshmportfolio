import React, { useEffect, useState } from "react";
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  type SocialLink,
} from "../../lib/supabase";

export const SocialLinksManager: React.FC = () => {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<{
    title: string;
    href: string;
    icon_name: string;
    sort_order: number;
    is_active: boolean;
  }>({
    title: "",
    href: "",
    icon_name: "",
    sort_order: 0,
    is_active: true,
  });
  const [editing, setEditing] = useState<SocialLink | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSocialLinks();
      setItems(data);
    } catch {
      setError("Failed to load social links");
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
        await updateSocialLink(editing.id, form);
        setSuccess("Social link updated successfully!");
        setEditing(null);
      } else {
        await createSocialLink(form);
        setSuccess("Social link created successfully!");
      }
      setForm({
        title: "",
        href: "",
        icon_name: "",
        sort_order: 0,
        is_active: true,
      });
      await load();
    } catch {
      setError("Failed to save social link");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this social link?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteSocialLink(id);
      setSuccess("Social link deleted successfully!");
      await load();
    } catch {
      setError("Failed to delete social link");
    }
  };

  const onEdit = (item: SocialLink) => {
    setEditing(item);
    setForm({
      title: item.title,
      href: item.href,
      icon_name: item.icon_name || "",
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Social Links
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your social media and professional profile links
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
          {editing ? "Edit Social Link" : "Add New Social Link"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Link Information Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Link Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Platform Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., GitHub, LinkedIn, Twitter"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  The name of the social platform or service
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={form.href}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Full URL to your profile on this platform
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Icon Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., github, linkedin, twitter"
                  value={form.icon_name}
                  onChange={(e) =>
                    setForm({ ...form, icon_name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Icon identifier for displaying the platform icon
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
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lower numbers appear first in the social links section
                </p>
              </div>
            </div>
          </div>

          {/* Visibility Settings Section */}
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
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                    title: "",
                    href: "",
                    icon_name: "",
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
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
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
              {editing ? "Update Link" : "Add Link"}
            </button>
          </div>
        </form>
      </div>

      {/* Social Links List */}
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
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          Social Media Links
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-pink-500"></div>
              <span className="text-sm font-medium">Loading social links…</span>
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No social links yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Add your first social media link using the form above
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.is_active
                            ? "bg-pink-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          {item.icon_name && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400">
                              {item.icon_name}
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            #{item.sort_order}
                          </span>
                        </div>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate block underline"
                        >
                          {item.href}
                        </a>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            item.is_active
                              ? "bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {item.is_active ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        title="Edit social link"
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
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        title="Delete social link"
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

export default SocialLinksManager;
