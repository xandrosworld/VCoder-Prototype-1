import { Languages } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import type { Language } from "../../i18n/translations";

const options: Array<{ value: Language; label: string; name: string }> = [
  { value: "en", label: "EN", name: "English" },
  { value: "vi", label: "VI", name: "Vietnamese" }
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex h-10 items-center rounded-md border border-slate-200 bg-white p-1"
      role="group"
      aria-label="Language"
    >
      <Languages className="mx-1 text-slate-500" size={16} aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          aria-pressed={language === option.value}
          aria-label={option.name}
          title={option.name}
          className={`h-8 min-w-9 rounded px-2 text-xs font-black ${
            language === option.value
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
