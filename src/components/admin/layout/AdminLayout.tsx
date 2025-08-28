import React, { useState } from "react";
import { Menu, Shield, ArrowLeft, LogOut } from "lucide-react";

interface SectionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface AdminLayoutProps {
  sections: SectionItem[];
  activeSectionId: string;
  onSelect: (id: string) => void;
  onLogout?: () => void;
  onBackToPortfolio?: () => void;
  userName?: string;
  userEmail?: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  sections,
  activeSectionId,
  onSelect,
  onLogout,
  onBackToPortfolio,
  userName,
  userEmail,
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {onBackToPortfolio && (
              <button
                onClick={onBackToPortfolio}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-1.5 sm:gap-2"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden min-[400px]:inline">
                  Back to Portfolio
                </span>
                <span className="min-[400px]:hidden">Back</span>
              </button>
            )}
            {userName && (
              <div className="text-xs sm:text-sm text-right hidden sm:block">
                <div className="font-medium text-gray-900 dark:text-white truncate max-w-[120px] lg:max-w-none">
                  {userName}
                </div>
                {userEmail && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] lg:max-w-none">
                    {userEmail}
                  </div>
                )}
              </div>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-1.5 sm:gap-2"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Shell */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside
          className={`lg:col-span-3 ${
            mobileOpen
              ? "fixed top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 z-50 lg:relative lg:top-auto lg:left-auto lg:right-auto lg:z-auto"
              : "hidden"
          } lg:block`}
        >
          <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl lg:shadow-lg">
            <div className="space-y-1 sm:space-y-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelect(s.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200 group ${
                    activeSectionId === s.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <span
                    className={`inline-flex w-4 h-4 sm:w-5 sm:h-5 items-center justify-center transition-transform duration-200 ${
                      activeSectionId === s.id
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    }`}
                  >
                    {s.icon}
                  </span>
                  <span className="flex-1 text-left text-sm sm:text-base">
                    {s.label}
                  </span>
                  {activeSectionId === s.id && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-9">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
