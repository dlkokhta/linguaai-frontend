import { useState } from "react";
import { Mic } from "lucide-react";

interface Props {
  text: string;
}

interface WordResult {
  word: string;
  correct: boolean;
}

function compareWords(original: string, spoken: string): WordResult[] {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  const origWords = normalize(original).split(/\s+/);
  const spokenWords = normalize(spoken).split(/\s+/);
  return origWords.map((word, i) => ({
    word,
    correct: word === (spokenWords[i] ?? ""),
  }));
}

export const SpeakPractice = ({ text }: Props) => {
  const [listening, setListening] = useState(false);
  const [results, setResults] = useState<WordResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSpeak = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SpeechRecognition() as any;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    setResults(null);
    setError(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const spoken: string = event.results[0][0].transcript;
      setResults(compareWords(text, spoken));
      setListening(false);
    };

    recognition.onerror = () => {
      setError("Could not hear you. Please try again.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const correctCount = results?.filter((r) => r.correct).length ?? 0;
  const total = results?.length ?? 0;

  return (
    <div>
      <button
        type="button"
        onClick={handleSpeak}
        disabled={listening}
        className={`cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors disabled:cursor-default ${
          listening
            ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 animate-pulse"
            : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        }`}
      >
        <Mic size={13} />
        {listening ? "Listening…" : "Speak"}
      </button>

      {results && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-1 mb-1">
            {results.map((r, i) => (
              <span
                key={i}
                className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                  r.correct
                    ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20"
                    : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 line-through"
                }`}
              >
                {r.word}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-gray-400">
            {correctCount} / {total} words correct
          </p>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
