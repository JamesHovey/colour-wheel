'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { questions, shuffleQuestions, answerValues, type AnswerLabel, type Colour } from '@/lib/questions';

type AnswerRecord = {
  questionId: number;
  colour: Colour;
  answerValue: number;
};

export default function Assessment() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  // Shuffle questions once on mount
  const shuffledQuestions = useMemo(() => shuffleQuestions(questions), []);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    const storedUsername = sessionStorage.getItem('username');

    if (!storedUserId) {
      router.push('/');
      return;
    }

    setUserId(storedUserId);
    setUsername(storedUsername || '');
  }, [router]);

  const currentQuestion = shuffledQuestions[currentIndex];
  const progress = Math.round((currentIndex / shuffledQuestions.length) * 100);

  const handleAnswer = async (label: AnswerLabel) => {
    const newAnswer: AnswerRecord = {
      questionId: currentQuestion.id,
      colour: currentQuestion.colour,
      answerValue: answerValues[label],
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All questions answered, submit results
      await submitResults(updatedAnswers);
    }
  };

  const submitResults = async (allAnswers: AnswerRecord[]) => {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId!),
          answers: allAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit results');
      }

      // Navigate to results page
      router.push(`/results/${data.id}`);
    } catch (err) {
      console.error('Error submitting results:', err);
      alert('Failed to submit your results. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-800">Calculating your results...</h2>
          <p className="text-slate-600 mt-2">Please wait while we analyse your answers</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-800">Colour Insights</h1>
          <span className="text-sm text-slate-500">Welcome, {username}</span>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-600">
          <span>Question {currentIndex + 1} of {shuffledQuestions.length}</span>
          <span>{progress}% complete</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full mb-4">
                Question {currentIndex + 1}
              </span>
              <h2 className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer Buttons */}
            <div className="space-y-3">
              {(Object.keys(answerValues) as AnswerLabel[]).map((label) => (
                <button
                  key={label}
                  onClick={() => handleAnswer(label)}
                  className="w-full py-4 px-6 text-left rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 group-hover:text-blue-700 font-medium">
                      {label}
                    </span>
                    <span className="text-slate-400 group-hover:text-blue-500 text-sm">
                      {answerValues[label]} point{answerValues[label] !== 1 ? 's' : ''}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation hint */}
          <p className="text-center text-sm text-slate-500 mt-4">
            Click an answer to continue
          </p>
        </div>
      </div>
    </main>
  );
}
