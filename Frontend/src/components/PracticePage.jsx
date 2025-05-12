import React, { useState, useEffect } from "react";

const allTags = [
  "2-sat", "binary search", "bitmasks", "brute force", "combinatorics",
  "constructive algorithms", "data structures", "dfs and similar", "divide and conquer",
  "dp", "dsu", "expression parsing", "fft", "flows", "games", "geometry",
  "graph matchings", "graphs", "greedy", "hashing", "implementation",
  "interactive", "math", "matrices", "number theory", "probabilities",
  "shortest paths", "sortings", "string suffix structures", "strings",
  "ternary search", "trees", "two pointers"
];

const difficultyRanges = {
  Easy: [800, 1200],
  Medium: [1300, 1700],
  Hard: [1800, 3000],
};

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedTags, setSelectedTags] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [perQuestionTime, setPerQuestionTime] = useState(10); // minutes per question
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      alert("Time's up!");
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const fetchDrill = async () => {
    setLoading(true);
    setError("");
    setProblems([]);
    try {
      const res = await fetch(
        "https://codeforces.com/api/problemset.problems"
      );
      const data = await res.json();
      if (data.status !== "OK") throw new Error();
      const all = data.result.problems;
      const [minR, maxR] = difficultyRanges[difficulty];
      const pool = (selectedTags.length ? selectedTags : allTags).sort(
        () => Math.random() - 0.5
      );
      const drill = [];
      const used = new Set();
      for (let tag of pool) {
        const candidates = all.filter(
          (p) =>
            p.rating >= minR &&
            p.rating <= maxR &&
            p.tags.includes(tag)
        );
        if (!candidates.length) continue;
        const prob =
          candidates[Math.floor(Math.random() * candidates.length)];
        const key = `${prob.contestId}-${prob.index}`;
        if (!used.has(key)) {
          drill.push({ ...prob, tag });
          used.add(key);
        }
        if (drill.length === numQuestions) break;
      }
      setProblems(drill);
      // total time = numQuestions * perQuestionTime
      const totalSeconds = numQuestions * perQuestionTime * 60;
      setTimeLeft(totalSeconds);
      setTimerActive(true);
    } catch {
      setError("Unable to load problems.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">Daily DSA Drill</h1>
        <p className="text-gray-400">
          {numQuestions} random problems · unique tags · timed challenge
        </p>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <label className="block text-sm mb-2 text-gray-300" htmlFor="difficulty">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 p-2 rounded text-white"
          >
            {Object.keys(difficultyRanges).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300" htmlFor="numQuestions">
            No. of Questions
          </label>
          <input
            id="numQuestions"
            type="number"
            min={1}
            max={10}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 p-2 rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300" htmlFor="perQuestionTime">
            Time/Ques (min)
          </label>
          <input
            id="perQuestionTime"
            type="number"
            min={5}
            max={30}
            value={perQuestionTime}
            onChange={(e) => setPerQuestionTime(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 p-2 rounded text-white"
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-sm mb-2 text-gray-300">
            Tags (optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-40 overflow-auto p-2 bg-[#111112]  rounded">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border transition whitespace-nowrap ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 border-blue-400 text-white"
                    : "bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center mb-6">
        <button
          onClick={fetchDrill}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Start Drill"}
        </button>
      </div>

      {/* Timer */}
      {timerActive && (
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-300">
            Time Remaining
          </label>
          <div className="w-full bg-gray-700 rounded">
            <div
              className="h-2 bg-green-500 transition-all"
              style={{ width: `${(timeLeft / (numQuestions * perQuestionTime * 60)) * 100}%` }}
            />
          </div>
          <p className="text-right text-sm text-gray-300 mt-1">
            {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}
          </p>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((p, i) => (
          <div
            key={`${p.contestId}-${p.index}`}
            className="bg-[#212124] border border-gray-700 rounded-lg p-4 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                {p.rating}
              </span>
              <span className="inline-block bg-yellow-500 text-black text-xs px-2 py-0.5 rounded">
                {p.tag}
              </span>
            </div>
            <a
              href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
              target="_blank"
              rel="noreferrer"
              className="block text-lg font-semibold text-white hover:underline"
            >
              {i + 1}. {p.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
