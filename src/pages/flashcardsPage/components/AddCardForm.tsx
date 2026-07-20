import { useState } from "react";
import { Plus, X } from "lucide-react";
import { axiosInstance } from "../../../context/AuthContext";
import { getErrorMessage } from "../../../types/errors";

interface Props {
  onAdded: () => void;
}

export const AddCardForm = ({ onAdded }: Props) => {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setFront("");
    setBack("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !front.trim() || !back.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await axiosInstance.post("/flashcards", {
        front: front.trim(),
        back: back.trim(),
      });
      close();
      onAdded();
    } catch (err) {
      setError(getErrorMessage(err, "Could not add the card. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer w-full py-3 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center justify-center gap-1.5"
      >
        <Plus size={16} />
        Add your own card
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">New card</h2>
        <button
          type="button"
          onClick={close}
          className="cursor-pointer p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="card-front" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Front — English word or phrase
          </label>
          <input
            id="card-front"
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            maxLength={500}
            placeholder="e.g. as soon as possible"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label htmlFor="card-back" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Back — Georgian translation
          </label>
          <input
            id="card-back"
            type="text"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            maxLength={500}
            placeholder="e.g. რაც შეიძლება მალე"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving || !front.trim() || !back.trim()}
        className="cursor-pointer w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Adding..." : "Add card"}
      </button>
    </form>
  );
};
