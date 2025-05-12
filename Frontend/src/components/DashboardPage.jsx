// import React, { useEffect, useState } from "react";
// import axios from "axios";

// // Simple replacements for Card and Button
// const Card = ({ children }) => (
//   <div className="border rounded-xl p-4 shadow-md bg-white">{children}</div>
// );

// const CardContent = ({ children }) => <div className="space-y-3">{children}</div>;

// const Button = ({ children, ...props }) => (
//   <button
//     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
//     {...props}
//   >
//     {children}
//   </button>
// );

// const DashboardPage = () => {
//   const [userData, setUserData] = useState(null);
//   const [contests, setContests] = useState([]);
//   const [bookmarks, setBookmarks] = useState([]);

//   useEffect(() => {
//     // Replace these with your actual API endpoints
//     axios.get("/api/user/profile").then(res => setUserData(res.data)).catch(console.error);
//     axios.get("/api/contests/upcoming").then(res => setContests(res.data)).catch(console.error);
//     axios.get("/api/user/bookmarks").then(res => setBookmarks(res.data)).catch(console.error);
//   }, []);

//   if (!userData) {
//     return <div className="text-center mt-10 text-lg">Loading dashboard...</div>;
//   }

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      
//       {/* Profile Info */}
//       <Card>
//         <CardContent>
//           <h2 className="text-xl font-bold">👤 Your Profile</h2>
//           <p><strong>Name:</strong> {userData.name}</p>
//           <p><strong>Email:</strong> {userData.email}</p>
//           <p><strong>Codeforces:</strong> {userData.codeforcesHandle}</p>
//           <p><strong>CodeChef:</strong> {userData.codechefHandle}</p>
//           <p><strong>LeetCode:</strong> {userData.leetcodeHandle}</p>
//           <p><strong>Rating:</strong> {userData.rating || "N/A"}</p>
//         </CardContent>
//       </Card>

//       {/* Project Overview */}
//       <Card>
//         <CardContent>
//           <h2 className="text-xl font-bold">📊 Project Overview</h2>
//           <ul className="list-disc pl-5 space-y-1">
//             <li>Fetch contests from Codeforces, CodeChef, and LeetCode</li>
//             <li>Bookmark contests with reminders</li>
//             <li>Integrated YouTube solution links</li>
//             <li>User profiles with platform handles</li>
//             <li>Personalized practice by rating and topics</li>
//           </ul>
//           <Button className="mt-4">Go to Practice Section</Button>
//         </CardContent>
//       </Card>

//       {/* Upcoming Contests */}
//       <Card>
//         <CardContent>
//           <h2 className="text-xl font-bold mb-3">📅 Upcoming Contests</h2>
//           <div className="space-y-2 max-h-64 overflow-y-auto">
//             {contests.length > 0 ? (
//               contests.map((contest, i) => (
//                 <div key={i} className="border p-2 rounded-md">
//                   <h3 className="font-semibold">{contest.name}</h3>
//                   <p>{contest.platform} – {new Date(contest.startTime).toLocaleString()}</p>
//                 </div>
//               ))
//             ) : (
//               <p>No upcoming contests available.</p>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Bookmarked Contests */}
//       <Card>
//         <CardContent>
//           <h2 className="text-xl font-bold mb-3">🔖 Bookmarked Contests</h2>
//           <div className="space-y-2 max-h-64 overflow-y-auto">
//             {bookmarks.length > 0 ? (
//               bookmarks.map((bookmark, i) => (
//                 <div key={i} className="border p-2 rounded-md">
//                   <h3 className="font-semibold">{bookmark.name}</h3>
//                   <p>{bookmark.platform} – {new Date(bookmark.startTime).toLocaleString()}</p>
//                 </div>
//               ))
//             ) : (
//               <p>You haven't bookmarked any contests.</p>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//     </div>
//   );
// };

// export default DashboardPage;
