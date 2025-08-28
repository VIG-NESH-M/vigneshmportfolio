import React, { useEffect, useState, useContext } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Navigation,
  Briefcase,
  Share2,
  Code,
  Zap,
  MessageSquare,
  PlusCircle,
  Mail,
  Settings,
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { RouterContext } from "../contexts/RouterContext";
import { AdminLayout } from "../components/admin/layout/AdminLayout";
import { ConfigManager } from "../components/admin/ConfigManager";
import { NavLinksManager } from "../components/admin/NavLinksManager";
import { ExperienceManager } from "../components/admin/ExperienceManager";
import { SocialLinksManager } from "../components/admin/SocialLinksManager";
import { ProjectsManager } from "../components/admin/ProjectsManager";
import { SkillsManager } from "../components/admin/SkillsManager";
import { MessagesManager } from "../components/admin/MessagesManager";
import {
  isCurrentUserAdmin,
  signInAdmin,
  signOut,
  getProjects,
  getSkills,
  getExperience,
  getSocialLinks,
  getNavLinks,
  getContactMessages,
  type Project,
  type Skill,
  type Experience,
  type SocialLink,
  type NavLink,
  type ContactMessage,
} from "../lib/supabase";

export const AdminShell: React.FC = () => {
  const router = useContext(RouterContext);
  if (!router) {
    throw new Error("AdminShell must be used within a RouterProvider");
  }
  const { navigate } = router;

  const onBackToPortfolio = () => {
    navigate("/");
  };

  const [active, setActive] = useState(
    "dashboard" as
      | "dashboard"
      | "config"
      | "nav"
      | "experience"
      | "socials"
      | "projects"
      | "skills"
      | "messages"
  );
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<{
    projects: Project[];
    skills: Skill[];
    experience: Experience[];
    socialLinks: SocialLink[];
    navLinks: NavLink[];
    messages: ContactMessage[];
    loading: boolean;
  }>({
    projects: [],
    skills: [],
    experience: [],
    socialLinks: [],
    navLinks: [],
    messages: [],
    loading: true,
  });

  const loadDashboardData = async () => {
    try {
      const [projects, skills, experience, socialLinks, navLinks, messages] =
        await Promise.all([
          getProjects(),
          getSkills(),
          getExperience(),
          getSocialLinks(),
          getNavLinks(),
          getContactMessages(),
        ]);

      setDashboardData({
        projects,
        skills,
        experience,
        socialLinks,
        navLinks,
        messages,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setDashboardData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const ok = await isCurrentUserAdmin();
        setAuthed(ok);
        if (ok) {
          await loadDashboardData();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reload dashboard data when switching to dashboard
  useEffect(() => {
    if (authed && active === "dashboard") {
      loadDashboardData();
    }
  }, [active, authed]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await signInAdmin(email, password);
      const ok = await isCurrentUserAdmin();
      setAuthed(ok);
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    try {
      await signOut();
      setAuthed(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Portal
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sign in to access the admin dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-6" onSubmit={onLogin}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Secure admin access • Portfolio Management System
              </p>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      sections={[
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
        { id: "config", label: "Config", icon: <FolderOpen /> },
        { id: "nav", label: "Navigation", icon: <Navigation /> },
        { id: "experience", label: "Experience", icon: <Briefcase /> },
        { id: "socials", label: "Socials", icon: <Share2 /> },
        { id: "projects", label: "Projects", icon: <Code /> },
        { id: "skills", label: "Skills", icon: <Zap /> },
        { id: "messages", label: "Messages", icon: <MessageSquare /> },
      ]}
      activeSectionId={active}
      onSelect={(id) =>
        setActive(
          id as
            | "dashboard"
            | "config"
            | "nav"
            | "experience"
            | "socials"
            | "projects"
            | "skills"
            | "messages"
        )
      }
      onLogout={onLogout}
      onBackToPortfolio={onBackToPortfolio}
    >
      {active === "dashboard" && (
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Portfolio Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Overview of your portfolio content and recent activity
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Projects Stats */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <button
                  onClick={() => setActive("projects")}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium"
                >
                  Manage →
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData.projects.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Projects
                </p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400">
                  {dashboardData.projects.filter((p) => p.is_featured).length}{" "}
                  featured •{" "}
                  {dashboardData.projects.filter((p) => p.is_active).length}{" "}
                  active
                </p>
              </div>
            </div>

            {/* Skills Stats */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <button
                  onClick={() => setActive("skills")}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium"
                >
                  Manage →
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData.skills.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Technical Skills
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {dashboardData.skills.filter((s) => s.is_active).length}{" "}
                  active skills
                </p>
              </div>
            </div>

            {/* Experience Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <button
                  onClick={() => setActive("experience")}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
                >
                  Manage →
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData.experience.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Work Experience
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {dashboardData.experience.filter((e) => e.is_active).length}{" "}
                  active positions
                </p>
              </div>
            </div>

            {/* Messages Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <button
                  onClick={() => setActive("messages")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData.messages.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contact Messages
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {dashboardData.messages.filter((m) => !m.is_read).length}{" "}
                  unread messages
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Recent Messages */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  Recent Messages
                </h3>
                <button
                  onClick={() => setActive("messages")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              {dashboardData.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500"></div>
                </div>
              ) : dashboardData.messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No messages yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.messages
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .slice(0, 3)
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg border ${
                          message.is_read
                            ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              message.is_read
                                ? "bg-gray-300 dark:bg-gray-600"
                                : "bg-blue-500"
                            }`}
                          ></div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {message.name}
                          </p>
                          {!message.is_read && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Management Actions */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setActive("projects")}
                  className="flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <PlusCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      Add Project
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Showcase new work
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActive("skills")}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <PlusCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      Add Skill
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Update expertise
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActive("experience")}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <PlusCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      Add Experience
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Update career history
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActive("config")}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      Site Settings
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Configure portfolio
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Content Overview */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              Portfolio Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {dashboardData.projects.filter((p) => p.is_active).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Active Projects
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {dashboardData.skills.filter((s) => s.is_active).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Visible Skills
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {dashboardData.socialLinks.filter((s) => s.is_active).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Social Links
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {dashboardData.navLinks.filter((n) => n.is_active).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Navigation Items
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {active === "config" && <ConfigManager />}
      {active === "nav" && <NavLinksManager />}
      {active === "experience" && <ExperienceManager />}
      {active === "socials" && <SocialLinksManager />}
      {active === "projects" && <ProjectsManager />}
      {active === "skills" && <SkillsManager />}
      {active === "messages" && <MessagesManager />}
    </AdminLayout>
  );
};

export default AdminShell;
