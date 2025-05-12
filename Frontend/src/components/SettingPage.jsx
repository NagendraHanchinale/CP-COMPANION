import React from "react";

const SettingPage = () => {
  // Get user data from localStorage
  const storedToken = localStorage.getItem("token");
  let user = {};

  try {
    user = storedToken ? JSON.parse(storedToken) : {};
  } catch (e) {
    console.error("Invalid token in localStorage:", e);
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-[#212124] p-6 space-y-6 mt-8">
      <h3 className="text-xl font-bold text-white">Account Settings</h3>

      {/* Name & Email Inputs */}
      {["Name", "Email"].map((label) => (
        <div key={label}>
          <label className="block text-sm text-gray-400 mb-1">{label}</label>
          <input
            type="text"
            defaultValue={user[label.toLowerCase()] || ""}
            className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-md"
          />
        </div>
      ))}

      {/* Password Section */}
      <div className="space-y-4">
        {["Old Password", "New Password", "Confirm Password"].map((label) => (
          <div key={label}>
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <input
              type="password"
              placeholder={label}
              className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-md"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
        Save Changes
      </button>
    </div>
  );
};

export default SettingPage;
