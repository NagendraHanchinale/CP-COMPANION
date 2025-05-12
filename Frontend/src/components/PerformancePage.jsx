"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import CCPerformancePage from "./Graphs/CCPerformancePage";
import Heatmap from "./Cards/Heatmap";
import CFPerformancePage from "./Graphs/CFPerformancePage";

const PerformancePage = () => {
  const [performance, setPerformance] = useState({
    codeforces: {},
    codechef: {},
    leetcode: {},
  });
  const [cfTags, setCfTags] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("CodeChef");
  const [platform, setPlatform] = useState("codechef");

  const userData = JSON.parse(localStorage.getItem("token"));
  console.log(`User Data:`, userData);

  const fetchCodeforcesData = async () => {
    try {
      const userRes = await axios.get("https://codeforces.com/api/user.info?handles=nagendra_bh");
      const ratingRes = await axios.get("https://codeforces.com/api/user.rating?handle=nagendra_bh");
      const submissionRes = await axios.get("https://codeforces.com/api/user.status?handle=nagendra_bh");

      const tagMap = {};
      submissionRes.data.result.forEach((sub) => {
        if (sub.verdict === "OK" && sub.problem.tags) {
          sub.problem.tags.forEach((tag) => {
            tagMap[tag] = (tagMap[tag] || 0) + 1;
          });
        }
      });

      setCfTags(tagMap);

      setPerformance((prev) => ({
        ...prev,
        codeforces: {
          rank: userRes.data.result[0].rank,
          rating: userRes.data.result[0].rating,
          ratingHistory: ratingRes.data.result,
          problemsSolved: Object.values(tagMap).reduce((a, b) => a + b, 0),
          contests: ratingRes.data.result.length,
        },
      }));
    } catch (error) {
      console.error("Error fetching Codeforces data:", error);
    }
  };

  const fetchLeetCodeData = async () => {
    try {
      const res = await axios.get("https://alfa-leetcode-api.onrender.com/userProfile/nagendra_bh");
      const data = res.data;

      setPerformance((prev) => ({
        ...prev,
        leetcode: {
          rating: data.rating,
          contests: data.contests || 0,
          problemsSolved: {
            easy: data.easySolved || 0,
            medium: data.mediumSolved || 0,
            hard: data.hardSolved || 0,
            total: (data.easySolved || 0) + (data.mediumSolved || 0) + (data.hardSolved || 0),
          },
        },
      }));
    } catch (err) {
      console.error("Error fetching LeetCode data:", err);
    }
  };

  const fetchCodeChefData = async () => {
    try {
      const res = await axios.get("https://codechef-api.vercel.app/handle/nagendra004");
      const data = res.data;

      setPerformance((prev) => ({
        ...prev,
        codechef: {
          rating: data.currentRating,
          rank: data.stars,
          contests: data.ratingData?.length || 0,
          problemsSolved: data.fullySolved?.count || 0,
          heatmap: data.heatmap || [],
          ratingHistory: data.ratingData || [],
        },
      }));
    } catch (err) {
      console.error("Error fetching CodeChef data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCodeforcesData();
    fetchLeetCodeData();
    fetchCodeChefData();
  }, []);

  const totalProblemsSolved =
    (performance.codeforces.problemsSolved || 0) +
    (performance.codechef.problemsSolved || 0) +
    (performance.leetcode.problemsSolved?.total || 0);

  const totalContests =
    (performance.codeforces.contests || 0) + (performance.codechef.contests || 0) + (performance.leetcode.contests || 0);

  const activeDays = performance.codechef.heatmap?.length || 0;

  const sortedTags = Object.entries(cfTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen bg-[#111112] text-white flex items-center justify-center">
        <p className="text-xl">Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#111112] text-white space-y-6">
      {/* Heatmap */}
      <Heatmap data={performance.codechef.heatmap} className="h-full" />

      {/* Contests and Problem Distribution */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#212124] p-4 rounded-xl">
          <p className="text-lg font-semibold mb-2">Total Contests</p>
          <p className="text-3xl font-bold">{totalContests}</p>
          <ul className="mt-2 text-sm text-gray-300">
            <li>CodeChef: {performance.codechef.contests || 0}</li>
            <li>Codeforces: {performance.codeforces.contests || 0}</li>
          </ul>
        </div>

        <div className="bg-[#212124] p-4 rounded-xl">
          <p className="text-lg font-semibold mb-2">Problems Solved</p>
          <div className="flex justify-between mb-1">
            <span>Easy</span>
            <span>{performance.leetcode.problemsSolved?.easy || 0}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Medium</span>
            <span>{performance.leetcode.problemsSolved?.medium || 0}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Hard</span>
            <span>{performance.leetcode.problemsSolved?.hard || 0}</span>
          </div>
        </div>
      </div>

      {/* Rating Chart and Rankings */}
      <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-700 bg-[#212124] p-6">
              <h2 className="text-lg font-bold mb-4">Rating History</h2>

              {/* Platform dropdown */}
              <div className="mb-4 ">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-[0] rounded-md border border-gray-600 focus:outline-none  appearance-none"
                >
                  <option value="codechef">CodeChef</option>
                  <option value="codeforces">Codeforces</option>
                </select>
              </div>

              <div className="h-65 rounded-md bg-gray-700 flex items-center justify-center overflow-hidden">
                {platform === "codechef" ? (
                  <CCPerformancePage />
                ) : (
                  <CFPerformancePage />
                )}
              </div>
            </div>

        <div className="bg-[#212124] p-4 rounded-xl">
          <p className="text-lg font-semibold mb-2">Contest Rankings</p>
          <ul className="text-sm text-gray-300">
            <li>LeetCode: {performance.leetcode.rating || "N/A"}</li>
            <li>CodeChef: {performance.codechef.rating || "N/A"}</li>
            <li>
              Codeforces: {performance.codeforces.rating || "N/A"}
              {performance.codeforces.rank ? ` (${performance.codeforces.rank})` : ""}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-[#212124] p-4 rounded-xl flex flex-col items-center justify-center">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default PerformancePage;
