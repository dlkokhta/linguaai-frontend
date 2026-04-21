import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuizQuestion } from './QuizQuestion';
import type { QuizQuestion as QuizQuestionType } from './QuizQuestion';

const mockSpeak = vi.fn();
const mockCancel = vi.fn();
Object.defineProperty(window, 'speechSynthesis', {
  value: { speak: mockSpeak, cancel: mockCancel },
  writable: true,
});
(global as any).SpeechSynthesisUtterance = vi.fn().mockImplementation((text: string) => ({ text }));

const QUESTION: QuizQuestionType = {
  display: 'She ___ ___ English right now.',
  options: ['is', 'was', 'studying', 'studied', 'are'],
  answers: ['is', 'studying'],
  full: 'She is studying English right now.',
};

const SINGLE_BLANK_QUESTION: QuizQuestionType = {
  display: 'He ___ coffee every morning.',
  options: ['drinks', 'drinking', 'drank', 'is', 'drink'],
  answers: ['drinks'],
  full: 'He drinks coffee every morning.',
};

describe('QuizQuestion', () => {
  const onNext = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('renders progress indicator', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={3} total={10} onNext={onNext} />);
    expect(screen.getByText('Question 3 of 10')).toBeInTheDocument();
  });

  it('renders all word options as buttons', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    ['is', 'was', 'studying', 'studied', 'are'].forEach((word) => {
      expect(screen.getByRole('button', { name: word })).toBeInTheDocument();
    });
  });

  it('shows wrong word feedback when incorrect word clicked', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'was' }));
    const feedback = screen.getByTestId('wrong-word-feedback');
    expect(feedback).toBeInTheDocument();
    expect(feedback.textContent).toContain('"was" is not correct here');
  });

  it('removes correctly placed word from word bank', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'is' }));
    expect(screen.queryByRole('button', { name: 'is' })).not.toBeInTheDocument();
  });

  it('shows the placed word in the sentence', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'is' }));
    const placed = screen.getAllByText('is');
    expect(placed.length).toBeGreaterThan(0);
  });

  it('shows Correct! after all blanks are filled', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'is' }));
    fireEvent.click(screen.getByRole('button', { name: 'studying' }));
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('shows Next Question button after completing a non-last question', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'is' }));
    fireEvent.click(screen.getByRole('button', { name: 'studying' }));
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  it('shows Finish Quiz button on the last question', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={10} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'is' }));
    fireEvent.click(screen.getByRole('button', { name: 'studying' }));
    expect(screen.getByRole('button', { name: /finish quiz/i })).toBeInTheDocument();
  });

  it('calls onNext when Next button is clicked', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'is' }));
    fireEvent.click(screen.getByRole('button', { name: 'studying' }));
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('hides word bank after all blanks are filled', () => {
    render(<QuizQuestion question={QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'is' }));
    fireEvent.click(screen.getByRole('button', { name: 'studying' }));
    expect(screen.queryByRole('button', { name: 'was' })).not.toBeInTheDocument();
  });

  it('works correctly with a single-blank question', () => {
    render(<QuizQuestion question={SINGLE_BLANK_QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'drinks' }));
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('resets state when question prop changes', () => {
    const { rerender } = render(<QuizQuestion question={QUESTION} questionNumber={1} total={10} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: 'is' }));
    rerender(<QuizQuestion question={SINGLE_BLANK_QUESTION} questionNumber={2} total={10} onNext={onNext} />);
    expect(screen.getByRole('button', { name: 'drinks' })).toBeInTheDocument();
  });
});
