import React, { useState, useEffect } from "react";
import axios from "axios";

const SolutionPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/get/solutions");
        const fetchedVideos = res.data;
        setVideos(fetchedVideos);
        setFilteredVideos(fetchedVideos);
        localStorage.setItem("solutionVideos", JSON.stringify(fetchedVideos)); // Save to localStorage
        setLoading(false);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to fetch videos");
        setLoading(false);
      }
    };

    const loadVideos = () => {
      const cachedVideos = localStorage.getItem("solutionVideos");
      if (cachedVideos) {
        const parsedVideos = JSON.parse(cachedVideos);
        setVideos(parsedVideos);
        setFilteredVideos(parsedVideos);
        setLoading(false);
      } else {
        fetchVideos();
      }
    };

    loadVideos();
  }, []);

  const handleFilterChange = (platform) => {
    setPlatformFilter(platform);
    if (platform === "All") {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter((video) =>
        video.title.toLowerCase().includes(platform.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  };

  return (
    <div className="text-white px-4 py-8">
      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-[#2c2c2e] pb-2 ">
        {["All", "Codeforces", "LeetCode", "CodeChef"].map((platform) => (
          <button
            key={platform}
            onClick={() => handleFilterChange(platform)}
            className={`px-4 py-2 text-sm font-medium rounded transition-all duration-300 ${
              platformFilter === platform
                ? "bg-white text-black"
                : "text-gray-400 hover:bg-[#1e1e1f] hover:text-white"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {/* Videos Section */}
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-[#111112] text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <div
              key={index}
              className="bg-[#1a1a1b] to-[#1a1a1a] border border-[#2c2c2c] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-[#3d3d3d] transition-all duration-300 flex flex-col"
            >
              <div className="relative group">
                <img
                  src={video.thumbnailUrl || "/default-thumbnail.jpg"}
                  alt={video.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.25v13.5L19.5 12 5.25 5.25z"
                    />
                  </svg>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mb-1 text-gray-100 line-clamp-2">
                  {video.title}
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-center bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300"
                >
                  Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolutionPage;
