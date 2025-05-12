import React, { useState, useEffect } from "react";
import axios from "axios";

const LeetCodeCard = ({ username }) => {
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      try {
        const res = await axios.get(
          `https://leetcode-stats-api.herokuapp.com/${username}`
        );
        setLeetcodeStats(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching LeetCode data:", error);
        setLoading(false);
      }
    };

    if (username) {
      fetchLeetCodeStats();
    }
  }, [username]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-[#212124] p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-white">LeetCode Stats</h3>
      <div className="mt-4">
        <div>
          <span className="text-gray-400">Total Problems Solved:</span>
          <span className="text-white">{leetcodeStats.totalSolved}</span>
        </div>
        <div>
          <span className="text-gray-400">Ranking:</span>
          <span className="text-white">{leetcodeStats.ranking}</span>
        </div>
        <div>
          <span className="text-gray-400">Acceptance Rate:</span>
          <span className="text-white">{leetcodeStats.acceptanceRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeCard;
