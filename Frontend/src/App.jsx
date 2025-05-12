import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
// import DashboardPage from "./components/DashboardPage";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import ContestPage from "./components/ContestPage";
import SolutionPage from "./components/SolutionPage";
import ProfilePage from "./components/ProfilePage";
import CFPerformancePage from "./components/Graphs/CFPerformancePage";
// import PerformancePage from "./components/PerformancePage";
import Heatmap from "./components/Cards/Heatmap";
import SettingPage from "./components/SettingPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Home" element={<HomePage />} />
          {/* <Route path="/contests" element={<ContestPage />} /> */}
          <Route path="/cf" element={<CFPerformancePage />} />
          <Route path="/dashboard" element={<SettingPage/>} />
          <Route path="/h" element={<Heatmap/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
