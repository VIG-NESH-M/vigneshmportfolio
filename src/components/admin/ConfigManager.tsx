import React, { useEffect, useState } from "react";
import {
  Settings,
  User,
  Zap,
  FileText,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Check,
  Loader,
} from "lucide-react";
import {
  getPortfolioConfig,
  updatePortfolioConfig,
  type PortfolioConfig,
} from "../../lib/supabase";

export const ConfigManager: React.FC = () => {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPortfolioConfig();
        setConfig(data);
      } catch {
        setError("Failed to load configuration");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field: keyof PortfolioConfig, value: string) => {
    if (!config) return;
    setConfig({ ...config, [field]: value } as PortfolioConfig);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const updatedConfig = await updatePortfolioConfig({
        name: config.name,
        email: config.email,
        about_tagline: config.about_tagline,
        about_content: config.about_content,
        hero_title: config.hero_title,
        hero_years_experience: config.hero_years_experience,
        hero_projects_completed: config.hero_projects_completed,
        hero_technologies: config.hero_technologies,
      });

      if (updatedConfig) {
        setConfig(updatedConfig);
        setSuccessMessage("Configuration updated successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError("Failed to save configuration - no data returned");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading configuration…</span>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">
            No configuration found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Please check your database connection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Site Configuration
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your portfolio's basic information and content
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
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
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-400">
                Success
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={config.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Hero Section
          </h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hero Title
            </label>
            <input
              type="text"
              value={config.hero_title}
              onChange={(e) => handleChange("hero_title", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="e.g., Full Stack Developer & UI/UX Designer"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This appears as the main headline on your homepage
            </p>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Hero Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Years Experience
              </label>
              <input
                type="text"
                value={config.hero_years_experience || "3+"}
                onChange={(e) =>
                  handleChange("hero_years_experience", e.target.value)
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g., 3+"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Display your years of experience
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Projects Completed
              </label>
              <input
                type="text"
                value={config.hero_projects_completed || "50+"}
                onChange={(e) =>
                  handleChange("hero_projects_completed", e.target.value)
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g., 50+"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Number of projects you've completed
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Technologies
              </label>
              <input
                type="text"
                value={config.hero_technologies || "15+"}
                onChange={(e) =>
                  handleChange("hero_technologies", e.target.value)
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g., 15+"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Number of technologies you work with
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            About Section
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                About Tagline
              </label>
              <input
                type="text"
                value={config.about_tagline}
                onChange={(e) => handleChange("about_tagline", e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g., Passionate about creating amazing digital experiences"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A short, catchy phrase about yourself
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                About Content
              </label>
              <textarea
                value={config.about_content}
                onChange={(e) => handleChange("about_content", e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                placeholder="Tell your story... Share your background, experience, and what drives your passion for development."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Detailed description for your about section
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Changes are saved automatically to your database
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigManager;
