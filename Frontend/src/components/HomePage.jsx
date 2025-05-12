import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContestPage from "./ContestPage"; // Import ContestPage component
import SolutionPage from "./SolutionPage";
import SettingPage from "./SettingPage";
import PracticePage from "./PracticePage";

import {
  HomeIcon,
  CalendarIcon,
  BookmarkIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ProfilePage from "./ProfilePage";

const menuItems = [
  // { name: "Dashboard", icon: <HomeIcon className="h-5 w-5 mr-3" /> },
  { name: "Contests", icon: <CalendarIcon className="h-5 w-5 mr-3" /> },
  // { name: "Bookmarks", icon: <BookmarkIcon className="h-5 w-5 mr-3" /> },
  { name: "Practice", icon: <CodeBracketIcon className="h-5 w-5 mr-3" /> },
  { name: "Solutions", icon: <DocumentTextIcon className="h-5 w-5 mr-3" /> },
  // { name: "Progress", icon: <ChartBarIcon className="h-5 w-5 mr-3" /> },
  { name: "Profile", icon: <UserIcon className="h-5 w-5 mr-3" /> },
  { name: "Settings", icon: <Cog6ToothIcon className="h-5 w-5 mr-3" /> },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Dashboard");
  let user = null;
  const stored = localStorage.getItem("token");
  user = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("token");
      user = stored ? JSON.parse(stored) : null;
      if (!user) {
        navigate("/");
      }
    } catch (err) {
      alert("Invalid token data", err);
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("contests");
    localStorage.removeItem("solutionVideos");
    localStorage.removeItem("handles");
    localStorage.removeItem("leetcodeStats");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 1500,
    });
    setTimeout(() => navigate("/"), 400);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen bg-[#111112] text-white overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#000000] border-r border-[#1e1e1e] flex flex-col justify-between">
          <div>
            <div className="text-2xl font-bold p-6">CP Companion</div>
            <ul className="mt-2 space-y-1">
              {menuItems.map(({ name, icon }) => (
                <li
                  key={name}
                  className={`flex items-center px-6 py-3 cursor-pointer transition-all ${
                    selected === name
                      ? "bg-white text-black font-semibold rounded-l-lg"
                      : "hover:bg-[#1f1f1f] text-gray-300"
                  }`}
                  onClick={() => setSelected(name)}
                >
                  {icon}
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* User Info + Logout */}
          <div className="text-sm text-gray-500 px-6 py-4 border-t border-[#1e1e1e] flex items-center justify-between">
            <div>
              {user?.name}
              <div className="text-xs text-gray-600">{user?.email}</div>
            </div>
            <button onClick={handleLogout} title="Logout">
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400 hover:text-red-500 transition duration-200" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 p-10 pt-1.5 h-full ${
            selected === "Profile" ? "overflow-y-hidden" : "overflow-y-auto"
          }`}
        >
          {/* <h1 className="text-3xl font-bold mb-6 text-center">{selected}</h1> */}
          {selected === "Contests" && <ContestPage />}
          {selected === "Practice" && <PracticePage />}
          {selected === "Solutions" && <SolutionPage />}
          {selected === "Profile" && <ProfilePage />}
          {selected === "Settings" && <SettingPage />}
          {/* Add more conditional pages if needed */}
        </div>
      </div>
    </>
  );
};

export default HomePage;
