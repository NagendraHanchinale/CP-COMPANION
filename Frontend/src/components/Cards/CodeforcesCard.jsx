import React, { useState, useEffect } from "react";
import axios from "axios";

const CodeforcesCard = ({ handle }) => {
  const [cfStats, setCfStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCodeforcesStats = async () => {
      try {
        const res = await axios.get(
          `https://codeforces.com/api/user.info?handles=${handle}`
        );
        const userData = res.data.result[0];
        setCfStats(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Codeforces data:", error);
        setLoading(false);
      }
    };

    if (handle) {
      fetchCodeforcesStats();
    }
  }, [handle]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-[#212124] p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-white">Codeforces Stats</h3>
      <div className="mt-4">
        <div>
          <span className="text-gray-400">Rating:</span>
          <span className="text-white">{cfStats.rating}</span>
        </div>
        <div>
          <span className="text-gray-400">Rank:</span>
          <span className="text-white">{cfStats.rank}</span>
        </div>
        <div>
          <span className="text-gray-400">Total Solved Problems:</span>
          <span className="text-white">{cfStats.solvedProblems}</span>
        </div>
      </div>
    </div>
  );
};

export default CodeforcesCard;
