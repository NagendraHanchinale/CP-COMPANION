import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ContestAPI } from "./api"; // Unified API
import { ExternalLink } from "lucide-react";

const ContestPage = () => {
  const [allContests, setAllContests] = useState([]);
  const [filterPlatforms, setFilterPlatforms] = useState([]);
  const [filterPhase, setFilterPhase] = useState("upcoming");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);

  const platformList = ["Codeforces", "LeetCode", "CodeChef"];

  useEffect(() => {
    const storedContests = localStorage.getItem("contests");
    if (storedContests) {
      setAllContests(JSON.parse(storedContests));
    } else {
      const fetchContests = async () => {
        setLoading(true);
        let combinedContests = [];

        for (const platform of platformList) {
          try {
            const contests = await ContestAPI.fetchContests(platform);
            combinedContests = [...combinedContests, ...contests];
          } catch {
            toast.error(`Failed to fetch ${platform} contests`, {
              position: "top-right",
              autoClose: 1500,
            });
          }
        }

        localStorage.setItem("contests", JSON.stringify(combinedContests));
        setAllContests(combinedContests);
        setLoading(false);
      };

      fetchContests();
    }
  }, []);

  const convertToIST = (timeInSeconds) => {
    const startTimeUTC = new Date(timeInSeconds * 1000);
    const startTimeIST = new Date(
      startTimeUTC.getTime() + 5.5 * 60 * 60 * 1000
    );
    return startTimeIST;
  };

  const filteredContests = allContests
    .filter((contest) => {
      const now = new Date();
      const start = convertToIST(contest.startTime);
      const end = new Date(start.getTime() + contest.duration * 1000);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);

      const platformMatch =
        filterPlatforms.length === 0 ||
        filterPlatforms.includes(contest.platform);
      const phaseMatch =
        filterPhase === "live"
          ? start <= now && now < end
          : filterPhase === "previous"
          ? end < now && start >= oneWeekAgo
          : start > now;

      return platformMatch && phaseMatch;
    })
    .sort((a, b) => a.startTime - b.startTime);

  return (
    <div className="bg-[#111112] min-h-screen p-6 text-white font-inter">
      <ToastContainer />

      {/* Top Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-[#2c2c2e] pb-2">
        {["All", ...platformList].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setFilterPlatforms(tab === "All" ? [] : [tab]);
            }}
            className={`px-4 py-2 text-sm font-medium rounded transition ${
              activeTab === tab
                ? "bg-white text-black"
                : "text-gray-400 hover:bg-[#1e1e1f] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Phase Filter */}
      <div className="flex gap-3 mb-6">
        {["upcoming", "live", "previous"].map((phase) => (
          <button
            key={phase}
            onClick={() => setFilterPhase(phase)}
            className={`px-4 py-1 text-sm rounded-full capitalize transition-all ${
              filterPhase === phase
                ? "bg-white text-black"
                : "bg-[#1f1f1f] text-gray-300 hover:bg-[#2a2a2a]"
            }`}
          >
            {phase}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading contests...</p>
      ) : filteredContests.length === 0 ? (
        <p className="text-gray-500">
          No contests found for the selected filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContests.map((contest) => {
            const start = convertToIST(contest.startTime);
            const end = new Date(start.getTime() + contest.duration * 1000);
            const now = new Date();
            const remaining = start - now;
            const hours = Math.floor(remaining / 1000 / 60 / 60);
            const mins = Math.floor((remaining / 1000 / 60) % 60);
            const isUpcoming = remaining > 0;
            const isPrevious = end < now;

            return (
              <div
                key={contest.id}
                className="bg-[#1a1a1b] rounded-2xl p-5 border border-[#2b2b2d] hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    {contest.platform}
                  </span>
                  <span className="text-xs bg-[#2c2c2e] text-gray-300 px-2 py-0.5 rounded-full">
                    {Math.round(contest.duration / 3600)} hrs
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {contest.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Starts at: {start.toLocaleString()}
                </p>
                <div
                  className={`mt-2 text-sm font-medium ${
                    isUpcoming
                      ? "text-yellow-400"
                      : isPrevious
                      ? "text-red-500"
                      : "text-green-400"
                  }`}
                >
                  {isUpcoming
                    ? `${hours}h ${mins}m remaining`
                    : isPrevious
                    ? "Finished"
                    : "Contest ongoing or started"}
                </div>

                <a
                  href={contest.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-black bg-white px-4 py-1.5 rounded-md hover:bg-gray-100 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Go To Contest
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContestPage;
