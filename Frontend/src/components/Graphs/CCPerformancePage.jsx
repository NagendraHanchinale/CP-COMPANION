import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { RefreshCw } from "lucide-react"; // optional icon library

const CCPerformancePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState(null);

  const fetchData = async (forceRefresh = false) => {
    const handlesData = JSON.parse(localStorage.getItem("handles"));
    const userHandle = handlesData?.[2]?.handle;

    if (!userHandle) return;

    setHandle(userHandle);

    const cacheKey = `cc-rating-${userHandle}`;
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/users/api/cc/rating?handle=${userHandle}`
      );
      const result = await response.json();

      const formatted = result.map((entry) => ({
        name: entry.name,
        rating: entry.rating,
        date: entry.date,
      }));

      setData(formatted);
      localStorage.setItem(cacheKey, JSON.stringify(formatted));
    } catch (error) {
      console.error("Failed to fetch CodeChef data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-65 bg-[#212124] p-6 text-white w-full relative">
      {/* Refresh button positioned at the top right */}
      <button
        onClick={() => fetchData(true)}
        className="absolute top-4 right-3 flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm rounded-md z-10"
      >
        <RefreshCw size={16} />
      </button>

      {loading ? (
        <div className="text-white text-center">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={data}>
            <CartesianGrid stroke="#444" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#ccc", fontSize: 12 }} />
            <YAxis
              domain={["dataMin - 100", "dataMax + 100"]}
              tick={{ fill: "#ccc" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#00bcd4"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CCPerformancePage;
