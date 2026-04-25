import { useState } from "react";
import { Bookmark, Check, Copy, FileText, Loader2, Volume2 } from "lucide-react";
import { axiosInstance } from "../../context/AuthContext";
import { Toast } from "../../components/Toast";

export const TranslateTextPage = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setTranslation(null);
    setSelectedText("");
    try {
      const res = await axiosInstance.post<{ translation: string }>("/translate/text", { text: text.trim() });
      setTranslation(res.data.translation);
    } catch {
      setError("Failed to translate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const selected = target.value.substring(target.selectionStart, target.selectionEnd).trim();
    setSelectedText(selected);
  };

  const handleSave = async () => {
    if (!selectedText) return;
    setSaving(true);
    const isWord = selectedText.trim().split(/\s+/).length === 1;
    try {
      if (isWord) {
        const res = await axiosInstance.post("/translate/word", { word: selectedText });
        await axiosInstance.post("/saved-words", {
          word: res.data.word,
          translation: res.data.translation,
          examples: res.data.examples,
        });
      } else {
        const res = await axiosInstance.post<{ translation: string }>("/translate/text", { text: selectedText });
        await axiosInstance.post("/saved-sentences", {
          en: selectedText,
          ka: res.data.translation,
          topic: "translate-text",
        });
      }
      setSelectedText("");
      setToast(isWord ? "Word saved!" : "Sentence saved!");
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!translation) return;
    await navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (content: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="tenses-scroll flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

        <div className="mb-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Translate Text</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Paste or type any English text to get a Georgian translation.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
          <form onSubmit={handleTranslate} className="space-y-3">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onSelect={handleTextSelect}
                onMouseUp={handleTextSelect}
                placeholder="Type or paste your English text here…"
                rows={5}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500 resize-none pb-7"
              />
              <p className="absolute bottom-2 right-3 text-[11px] text-gray-400 dark:text-gray-500 select-none">
                {text.trim() ? text.trim().split(/\s+/).length : 0} words · {text.length} chars
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 text-sm rounded-xl font-medium disabled:opacity-60 transition-all"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                {loading ? "Translating…" : "Translate"}
              </button>
              <button
                type="button"
                onClick={() => speakText(text)}
                disabled={!text.trim()}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-40 transition-colors"
              >
                <Volume2 size={15} />
                Listen (EN)
              </button>
              {selectedText && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="cursor-pointer flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Bookmark size={15} />}
                  {saving ? "Saving…" : "Save"}
                </button>
              )}
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {translation && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Georgian Translation</p>
              <button
                type="button"
                onClick={handleCopy}
                className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {translation}
            </p>
          </div>
        )}

      </main>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};
