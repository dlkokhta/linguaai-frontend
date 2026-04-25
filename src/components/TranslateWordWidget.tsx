import { useState } from "react";
import { Bookmark, Languages, Loader2, Volume2 } from "lucide-react";
import { axiosInstance } from "../context/AuthContext";
import { Toast } from "./Toast";
import { speakText } from "../utils/audio";

interface TranslationResult {
  word: string;
  translation: string;
  examples: { en: string; ka: string }[];
}

export const TranslateWordWidget = () => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [revealedExamples, setRevealedExamples] = useState<Set<number>>(new Set());

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setRevealedExamples(new Set());
    setSavedId(null);
    try {
      const res = await axiosInstance.post<TranslationResult>("/translate/word", { word: word.trim() });
      setResult(res.data);
    } catch {
      setError("Translation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      if (savedId) {
        await axiosInstance.delete(`/saved-words/${savedId}`);
        setSavedId(null);
      } else {
        const res = await axiosInstance.post<{ id: string }>("/saved-words", {
          word: result.word,
          translation: result.translation,
          examples: result.examples,
        });
        setSavedId(res.data.id);
        setToast("Word saved!");
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const toggleExample = (index: number) => {
    setRevealedExamples((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500 mb-3">Translate Word</p>

        <form onSubmit={handleTranslate} className="space-y-2">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="e.g. eloquent, journey…"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:text-white dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={loading || !word.trim()}
            className="cursor-pointer w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium disabled:opacity-60 transition-all"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Languages size={13} />}
            {loading ? "Translating…" : "Translate"}
          </button>
        </form>

        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

        {result && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white">{result.word}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{result.translation}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => speakText(result.word)}
                  className="cursor-pointer p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  title="Listen"
                >
                  <Volume2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={`cursor-pointer p-1.5 rounded-lg transition-colors disabled:opacity-60 ${
                    savedId
                      ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title={savedId ? "Unsave" : "Save"}
                >
                  <Bookmark size={14} className={savedId ? "fill-current" : ""} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {result.examples.map((ex, i) => (
                <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed flex-1">{ex.en}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => speakText(ex.en)}
                        className="cursor-pointer p-1 rounded text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                        title="Listen"
                      >
                        <Volume2 size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleExample(i)}
                        className="cursor-pointer text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {revealedExamples.has(i) ? "Hide" : "KA"}
                      </button>
                    </div>
                  </div>
                  {revealedExamples.has(i) && (
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-emerald-400 pl-2">
                      {ex.ka}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
};
