import React, { useEffect, useState } from "react";
import { RefreshCw, Save, Monitor } from "lucide-react";
import { getPortfolioConfig, updatePortfolioConfig } from "../../lib/supabase";

type SectionId =
  | "hero"
  | "about"
  | "experience"
  | "toolkit"
  | "work"
  | "socials"
  | "contact";

const SECTIONS: { id: SectionId; label: string; variants: string[] }[] = [
  { id: "hero", label: "Hero", variants: ["v1", "v2", "v3", "v4", "v5"] },
  { id: "about", label: "About", variants: ["v1", "v2", "v3"] },
  { id: "experience", label: "Experience", variants: ["v1", "v2"] },
  { id: "toolkit", label: "Toolkit", variants: ["v1", "v2"] },
  { id: "work", label: "Projects", variants: ["v1", "v2", "v3"] },
  { id: "socials", label: "Socials", variants: ["v1", "v2"] },
  { id: "contact", label: "Contact", variants: ["v1", "v2"] },
];

const DEFAULTS: Record<SectionId, string> = {
  hero: "v1",
  about: "v1",
  experience: "v1",
  toolkit: "v1",
  work: "v1",
  socials: "v1",
  contact: "v1",
};

export const SectionVariantsManager: React.FC = () => {
  const [variants, setVariants] = useState<Record<string, string>>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const cfg = await getPortfolioConfig();
      if (cfg?.section_variants) {
        setVariants({ ...DEFAULTS, ...cfg.section_variants });
      } else {
        setVariants(DEFAULTS);
      }
      setLoading(false);
    })();
  }, []);

  const onChange = (id: SectionId, value: string) => {
    setVariants((prev) => ({ ...prev, [id]: value }));
    // Optional: live preview hook here later
  };

  const onSave = async () => {
    setSaving(true);
    await updatePortfolioConfig({ section_variants: variants });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="ml-2 text-gray-300">Loading variants...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="w-8 h-8 text-emerald-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Layouts</h1>
            <p className="text-gray-400">
              Choose layout variants for each section
            </p>
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? "Saving..." : "Save"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTIONS.map((s) => (
          <div
            key={s.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">{s.label}</h2>
              <p className="text-sm text-gray-400">Select a layout</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {s.variants.map((v) => {
                const active = variants[s.id] === v;
                return (
                  <button
                    key={v}
                    onClick={() => onChange(s.id, v)}
                    className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                      active
                        ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
                        : "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    {s.label} {v.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionVariantsManager;
