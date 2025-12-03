'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { colourConfig, type Colour } from '@/lib/questions';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

type ResultData = {
  id: number;
  username: string;
  redScore: number;
  yellowScore: number;
  blueScore: number;
  greenScore: number;
  redPercent: number;
  yellowPercent: number;
  bluePercent: number;
  greenPercent: number;
  completedAt: string;
};

export default function Results() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/results/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load results');
        }

        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchResult();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your results...</p>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {error || 'Results not found'}
          </h2>
          <p className="text-slate-600 mb-6">
            We couldn&apos;t find your results. Please try again.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Assessment
          </button>
        </div>
      </main>
    );
  }

  const colourScores: { colour: Colour; score: number; percent: number }[] = [
    { colour: 'red', score: result.redScore, percent: result.redPercent },
    { colour: 'yellow', score: result.yellowScore, percent: result.yellowPercent },
    { colour: 'blue', score: result.blueScore, percent: result.bluePercent },
    { colour: 'green', score: result.greenScore, percent: result.greenPercent },
  ];

  // Sort by percentage descending
  const sortedScores = [...colourScores].sort((a, b) => b.percent - a.percent);
  const dominantColour = sortedScores[0];

  const chartData = {
    labels: colourScores.map((c) => colourConfig[c.colour].name),
    datasets: [
      {
        data: colourScores.map((c) => c.percent),
        backgroundColor: colourScores.map((c) => colourConfig[c.colour].hex),
        borderColor: '#ffffff',
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'pie'>) => {
            return `${context.label}: ${(context.raw as number).toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Your Colour Profile
          </h1>
          <p className="text-slate-600">
            {result.username}, here are your personality insights
          </p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          {/* Dominant Colour Banner */}
          <div
            className="rounded-xl p-6 mb-8 text-center text-white"
            style={{ backgroundColor: colourConfig[dominantColour.colour].hex }}
          >
            <p className="text-sm opacity-90 mb-1">Your dominant colour is</p>
            <h2 className="text-3xl font-bold">
              {colourConfig[dominantColour.colour].name}
            </h2>
            <p className="text-lg mt-1">
              {dominantColour.percent.toFixed(1)}%
            </p>
          </div>

          {/* Chart */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 h-64 md:h-80">
              <Pie data={chartData} options={chartOptions} />
            </div>

            {/* Score Breakdown */}
            <div className="w-full md:w-1/2 space-y-4">
              {sortedScores.map(({ colour, score, percent }) => (
                <div key={colour} className="flex items-center gap-4">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colourConfig[colour].hex }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-700">
                        {colourConfig[colour].name}
                      </span>
                      <span className="text-slate-600">
                        {percent.toFixed(1)}% ({score} points)
                      </span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: colourConfig[colour].hex,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-slate-600 mb-2">Total Score</p>
            <p className="text-3xl font-bold text-slate-800">
              {result.redScore + result.yellowScore + result.blueScore + result.greenScore} points
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Out of a maximum of 200 points (40 questions × 5 points)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Take Assessment Again
          </button>
          <p className="text-sm text-slate-500">
            Completed on {new Date(result.completedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </main>
  );
}
