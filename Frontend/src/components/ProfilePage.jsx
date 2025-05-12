import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NProgress, { set } from "nprogress";
import "nprogress/nprogress.css";
import CFPerformancePage from "./Graphs/CFPerformancePage";
import CCPerformancePage from "./Graphs/CCPerformancePage";
import Heatmap from "./Cards/Heatmap";

export default function ProfilePage() {
  const [activeFilter, setActiveFilter] = useState("overview");
  const [user, setUser] = useState({});
  const [handles, setHandles] = useState([
    { platform: "Codeforces", handle: "", rating: "", rank: "" },
    { platform: "LeetCode", handle: "", rating: "", rank: "" },
    { platform: "CodeChef", handle: "", rating: "", rank: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [vloading, setVloading] = useState(null);
  const [platform, setPlatform] = useState("codeforces");
  const [lcProblemSolved, setLcProblemSolved] = useState({
    total: "",
    easy: "",
    medium: "",
    hard: "",
  });
  const totalProblems = 3535; // Example total from image
  const attempting = 1;
  const [cfContest , setCfContest] = useState(0);
  const [ccContest, setCcContest] = useState(0);

  const percentage = (lcProblemSolved.total / totalProblems) * 100;

  useEffect(() => {
    const fetchData = async () => {
      
      setLoading(true);
      const stored = localStorage.getItem("token");
      const userData = stored ? JSON.parse(stored) : null;
      if (!userData) return alert("Invalid token data");

      setUser(userData);

      const solved = localStorage.getItem("leetcodeStats");
      if (solved) {
        const stats = JSON.parse(solved);
        setLcProblemSolved(stats);
      }

      // Load handles from localStorage if available
      const cachedHandles = localStorage.getItem("handles");
      if (cachedHandles) {
        setHandles(JSON.parse(cachedHandles));
        setLoading(false);
        return;
      }

      try{
         const res = await axios.get(`http://localhost:3000/users/api/cf-contest-no?handle=${userData.email}`);
          const data = res.data;
          setCfContest(data);
          console.log("Contest data:", data);
      }catch(err){
          console.error("Error fetching handle data:", err);
      }

      try{
        const res = await axios.get(`http://localhost:3000/users/api/cc-contest-no?handle=${userData.email}`);
         const data = res.data;
         setCfContest(data);
         console.log("Contest data:", data);
     }catch(err){
         console.error("Error fetching handle data:", err);
     }

      try {
        const res = await axios.get(
          `http://localhost:3000/users/api/get-handles?email=${userData.email}`
        );
        const data = res.data;

        if (data.length === 0) {
          const defaultHandles = [
            { platform: "Codeforces", handle: "", rating: "", rank: "" },
            { platform: "LeetCode", handle: "", rating: "", rank: "" },
            { platform: "CodeChef", handle: "", rating: "", rank: "" },
          ];
          setHandles(defaultHandles);
          localStorage.setItem("handles", JSON.stringify(defaultHandles));
          return;
        }

        const getRating = async (platform, handle) => {
          const apiMap = {
            Codeforces: "cf-varify",
            LeetCode: "lc-varify",
            CodeChef: "cc-varify",
          };

          try {
            const res = await axios.get(
              `http://localhost:3000/users/api/${apiMap[platform]}?handle=${handle}`
            );

            console.log(res.data);

            if (platform === "LeetCode") {
              const problemStats = {
                total: res.data.problemsSolved ,
                easy: res.data.EasySolved ,
                medium: res.data.MeduimSolved,
                hard: res.data.HardSolved,
              };

              // 1. Store in state
              setLcProblemSolved(problemStats);

              // 2. Store in localStorage
              localStorage.setItem(
                "leetcodeStats",
                JSON.stringify(problemStats)
              );
            }

            return { rating: res.data.rating, rank: res.data.rank };
          } catch (err) {
            console.error(`Failed to fetch ${platform} rating`, err);
            return { rating: "", rank: "" };
          }
        };

        const newHandles = await Promise.all([
          getRating("Codeforces", data[0].codeforces_handle || "").then(
            (r) => ({
              platform: "Codeforces",
              handle: data[0].codeforces_handle || "",
              ...r,
            })
          ),
          getRating("LeetCode", data[0].leetcode_handle || "").then((r) => ({
            platform: "LeetCode",
            handle: data[0].leetcode_handle || "",
            ...r,
          })),
          getRating("CodeChef", data[0].codechef_handle || "").then((r) => ({
            platform: "CodeChef",
            handle: data[0].codechef_handle || "",
            ...r,
          })),
        ]);

        setHandles(newHandles);
        localStorage.setItem("handles", JSON.stringify(newHandles));
      } catch (err) {
        console.error("Error fetching handle data:", err);
      } finally {
        setLoading(false);
      }
    };

    NProgress.start();
    fetchData();
    NProgress.done();
  }, []);

  const handleVerify = async (platform, idx) => {
    setVloading(idx); // Set loading for the clicked button
    const platformIndex = { Codeforces: 0, LeetCode: 1, CodeChef: 2 };
    const handle = handles[idx].handle;

    const verifyUrls = {
      Codeforces: `http://localhost:3000/users/api/cf-varify?handle=${handle}`,
      LeetCode: `http://localhost:3000/users/api/lc-varify?handle=${handle}`,
      CodeChef: `http://localhost:3000/users/api/cc-varify?handle=${handle}`,
    };

    try {
      const res = await axios.get(verifyUrls[platform]);
      const updatedHandles = [...handles];
      updatedHandles[idx] = {
        ...updatedHandles[idx],
        rating: res.data.rating,
        rank: res.data.rank,
      };
      setHandles(updatedHandles);

      await axios.post("http://localhost:3000/users/api/set-handles", {
        email: user.email,
        codeforces: handles[0].handle,
        leetcode: handles[1].handle,
        codechef: handles[2].handle,
      });

      toast.success(`${platform} handle verified successfully.`);
      localStorage.removeItem("handles");
      // console.log("Updated handles:", updatedHandles);
      localStorage.setItem("handles", JSON.stringify(updatedHandles));

      // Change the button color to green for 5 seconds
      setTimeout(() => {
        setVloading(null); // Reset loading state
      }, 5000);
    } catch (err) {
      console.error(`Error verifying ${platform} handle:`, err);
      toast.error(`Failed to verify ${platform} handle.`);
      setVloading(null); // Reset loading state on failure
    }
    setVloading(null);
  };

  const handleInputChange = (idx, value) => {
    const newHandles = [...handles];
    newHandles[idx].handle = value;
    setHandles(newHandles);
  };

  const renderSection = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full bg-[#111112] text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      );
    }

    if (activeFilter === "overview") {
      return (
        <div className="space-y-6 h-full flex flex-col justify-evenly">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            {/* Profile Card */}
            <div className="rounded-lg border border-gray-700 bg-[#212124] p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-gray-600 flex items-center justify-center text-2xl">
                  👤
                </div>
                <h3 className="text-2xl font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
                <div className="flex gap-5  pt-2 flex-wrap justify-center">
                  {handles.map((h) => (
                    <span
                      key={h.platform}
                      className={`px-5 py-1 rounded-full text-xs font-semibold text-black 
                      ${h.rank ? "bg-green-500" : "bg-red-500"} 
                      ${h.platform === "Codeforces" ? "bg-blue-500" : ""}
                      ${h.platform === "CodeChef" ? "bg-orange-500" : ""}
                      ${
                        h.platform === "LeetCode"
                          ? "bg-yellow-400 text-black"
                          : ""
                      }
                    `}
                    >
                      {h.platform}: {h.rank || "N/A"}
                    </span>
                  ))}
                </div>
                <button
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md font-semibold mt-4"
                  onClick={() => setActiveFilter("cpHandles")}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Rating History */}
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
          </div>

          {/* Statistics */}
          <div className="w-full rounded-lg border border-gray-700 bg-[#212124] p-6 flex flex-col md:flex-row items-center justify-evenly gap-5 h-[25%]">
           <h1 className="text-2xl font-bold mb-4">LeetCode Statistics</h1>
            {/* Left Section: Total Solved */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-white">
                {lcProblemSolved.total}
              </div>
              <div className="text-sm text-gray-400 mt-1">Solved</div>
            </div>

            {/* Right Section: Difficulty Stats */}
            <div className="flex gap-[30px] text-sm">
              <div className="flex justify-between items-center bg-[#2a2a2e] px-4 py-2 rounded w-40">
                <span className="text-[#00b8a3] font-medium">Easy</span>
                <span className="text-white">{lcProblemSolved.easy}/873</span>
              </div>
              <div className="flex justify-between items-center bg-[#2a2a2e] px-4 py-2 rounded w-40">
                <span className="text-[#f5a623] font-medium">Med.</span>
                <span className="text-white">
                  {lcProblemSolved.medium}/1835
                </span>
              </div>
              <div className="flex justify-between items-center bg-[#2a2a2e] px-4 py-2 rounded w-40">
                <span className="text-[#e74c3c] font-medium">Hard</span>
                <span className="text-white">{lcProblemSolved.hard}/827</span>
              </div>
            </div>
            
          </div>
          {/* <Heatmap/> */}
        </div>
      );
    }

    if (activeFilter === "cpHandles") {
      return (
        <div className="rounded-lg border border-gray-700 bg-[#212124] p-6 space-y-6 mt-8">
          <h3 className="text-xl font-bold">Competitive Programming Handles</h3>
          {handles.map((h, idx) => (
            <div key={h.platform} className="space-y-2">
              <h4 className="text-lg font-semibold">{h.platform}</h4>
              <p className="text-sm text-gray-400">
                Connect your {h.platform} account
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={h.handle}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  className="flex-1 bg-gray-800 text-white border border-gray-600 p-3 rounded-md"
                />
                {vloading === idx ? (
                  <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                ) : (
                  <button
                    className={`${
                      vloading === idx
                        ? "bg-blue-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    } text-white px-4 py-2 rounded-md`}
                    onClick={() => handleVerify(h.platform, idx)}
                  >
                    Verify
                  </button>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {h.rank && (
                  <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-xs font-semibold">
                    {h.rank}
                  </span>
                )}
                {h.rating && <span className="text-sm">{h.rating}</span>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeFilter === "accountSettings") {
      return (
        <div className="rounded-lg border border-gray-700 bg-[#212124] p-6 space-y-6 mt-8">
          <h3 className="text-xl font-bold">Account Settings</h3>
          {["Name", "Email", "Password"].map((label) => (
            <div key={label}>
              <label className="block text-sm text-gray-400 mb-1">
                {label}
              </label>
              <input
                type={label === "Password" ? "password" : "text"}
                defaultValue={
                  label === "Password" ? "" : user[label.toLowerCase()] || ""
                }
                className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-md"
              />
            </div>
          ))}
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
            Save Changes
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-5 p-4 bg-[#111112] h-screen text-white overflow-hidden">
      <ToastContainer />
      <div className="flex gap-3">
        {["overview", "cpHandles"].map((phase) => (
          <button
            key={phase}
            onClick={() => setActiveFilter(phase)}
            className={`px-5 py-2 rounded-full text-sm capitalize font-semibold border ${
              activeFilter === phase
                ? "bg-white text-black border-white"
                : "bg-[#212124] text-gray-400 border-gray-700 hover:bg-gray-700"
            }`}
          >
            {phase === "overview"
              ? "Overview"
              : phase === "cpHandles"
              ? "CP Handles"
              : "Account Settings"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">{renderSection()}</div>
    </div>
  );
}
