import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layers } from "lucide-react";
import { axiosInstance, useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../types/errors";
import { FlashcardsStart } from "./components/FlashcardsStart";
import { FlashcardsSession } from "./components/FlashcardsSession";
import { FlashcardsSummary } from "./components/FlashcardsSummary";

export interface FlashcardStats {
  due: number;
  new: number;
  learned: number;
  total: number;
}

export interface FlashcardExample {
  en: string;
  ka: string;
}

export type Grade = "AGAIN" | "GOOD" | "EASY";

export interface QueueCard {
  id: string;
  cardType: "WORD" | "SENTENCE";
  savedWord: {
    id: string;
    word: string;
    translation: string;
    examples: FlashcardExample[];
  } | null;
  savedSentence: { id: string; en: string; ka: string; topic: string } | null;
  preview: { again: number; good: number; easy: number };
}

export interface GradeCounts {
  again: number;
  good: number;
  easy: number;
}

type Screen = "start" | "session" | "done";

export const FlashcardsPage = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const [screen, setScreen] = useState<Screen>("start");
  const [cards, setCards] = useState<QueueCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counts, setCounts] = useState<GradeCounts>({ again: 0, good: 0, easy: 0 });
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: stats, isPending } = useQuery({
    queryKey: ["flashcard-stats"],
    queryFn: () =>
      axiosInstance.get<FlashcardStats>("/flashcards/stats").then((r) => r.data),
    enabled: !!accessToken,
  });

  const refreshStats = () =>
    queryClient.invalidateQueries({ queryKey: ["flashcard-stats"] });

  const startSession = async () => {
    setStarting(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<QueueCard[]>("/flashcards/queue");
      if (data.length === 0) {
        refreshStats();
        return;
      }
      setCards(data);
      setCurrentIndex(0);
      setCounts({ again: 0, good: 0, easy: 0 });
      setScreen("session");
    } catch (err) {
      setError(getErrorMessage(err, "Could not load your cards. Please try again."));
    } finally {
      setStarting(false);
    }
  };

  const handleGrade = async (grade: Grade) => {
    const card = cards[currentIndex];
    setSubmitting(true);
    setError(null);
    try {
      await axiosInstance.post(`/flashcards/${card.id}/answer`, { grade });

      const key = grade.toLowerCase() as keyof GradeCounts;
      setCounts((c) => ({ ...c, [key]: c[key] + 1 }));

      // "Again" cards come back at the end of the session (repetitions reset to 0)
      let queue = cards;
      if (grade === "AGAIN") {
        queue = [...cards, { ...card, preview: { again: 0, good: 1, easy: 3 } }];
        setCards(queue);
      }

      if (currentIndex + 1 >= queue.length) {
        refreshStats();
        setScreen("done");
      } else {
        setCurrentIndex((i) => i + 1);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Could not save your answer. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setScreen("start");
    setError(null);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="tenses-scroll flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Layers size={18} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Flashcards</h1>
        </div>

        {screen === "start" && (
          <FlashcardsStart
            stats={stats}
            isPending={isPending}
            starting={starting}
            error={error}
            onStart={startSession}
          />
        )}

        {screen === "session" && currentCard && (
          <FlashcardsSession
            key={`${currentCard.id}-${currentIndex}`}
            card={currentCard}
            currentIndex={currentIndex}
            total={cards.length}
            submitting={submitting}
            error={error}
            onGrade={handleGrade}
          />
        )}

        {screen === "done" && <FlashcardsSummary counts={counts} onRestart={restart} />}
      </main>
    </div>
  );
};
