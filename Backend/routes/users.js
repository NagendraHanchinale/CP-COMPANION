const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Optional: Check if user already exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert into DB with hashed password
    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the hashed password with the input password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate a JWT token for the session
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Use JWT_SECRET from environment variables
      { expiresIn: "1h" } // Token expiry time
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/api/leetcode", async (req, res) => {
  console.log("Received request to /api/leetcode");
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const data = await fetchLeetcodeProfile(username); // wrap your logic here
  if (!data) return res.status(404).json({ error: "User not found" });
  res.json(data);
});

router.get("/api/cf-varify", async (req, res) => {
  const handle = req.query.handle; // Use query param like /api/cf-varify?handle=nagendra_bh
  console.log("Received request to /api/cf-varify with handle:", handle);
  if (!handle) {
    return res.status(400).json({ error: "Handle is required" });
  }

  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const data = await response.json();

    if (data.status !== "OK") {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the first user object (API returns array of users)
    const user = data.result[0];

    res.json({
      rating: user.rating,
      titlePhoto: user.titlePhoto,
      rank: user.rank,
      handle: user.handle,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Codeforces data" });
  }
});

router.get("/api/cc-varify", async (req, res) => {
  const handle = req.query.handle;
  console.log("Received request to /api/cc-varify with handle:", handle);
  if (!handle) {
    return res.status(400).json({ error: "Handle is required" });
  }

  try {
    const response = await fetch(
      `https://codechef-api.vercel.app/handle/${handle}`
    );
    const data = await response.json();

    if (data.status !== 200 || !data.name) {
      return res
        .status(404)
        .json({ error: "User not found or invalid response" });
    }

    const user = {
      rating: data.currentRating,
      titlePhoto: data.profile || "",
      rank: data.stars,
      handle: handle,
      avatar: data.profile || "",
    };

    // console.log("CodeChef user data:", user);

    res.json({
      username: handle,
      name: data.name,
      rating: data.currentRating,
      rank: data.stars,
      profile: data.profile,
      highestRating: data.highestRating,
      globalRank: data.globalRank,
      countryRank: data.countryRank,
      countryFlag: data.countryFlag,
      countryName: data.countryName,
    });
  } catch (err) {
    console.error("Failed to fetch CodeChef data:", err);
    res.status(500).json({ error: "Failed to fetch CodeChef data" });
  }
});

router.get("/api/lc-varify", async (req, res) => {
  const handle = req.query.handle;
  console.log("Received request to /api/lc-varify with handle:", handle);

  if (!handle) {
    return res.status(400).json({ error: "Handle is required" });
  }

  try {
    const response = await fetch(
      // `https://leetcode-stats-api.herokuapp.com/${handle}`
      `https://alfa-leetcode-api.onrender.com/${handle}/solved`
    );
    console.log("LeetCode API URL:", response); // Log the URL for debugging
    const data = await response.json();
    console.log("LeetCode user data:", data.easySolved);

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    const contest = await fetch(
      `https://alfa-leetcode-api.onrender.com/userContestRankingInfo/` + handle
    );
    const contestData = await contest.json();
    // console.log("Contest data:", contestData.data.userContestRanking);
    const contestRating = contestData.data.userContestRanking.rating;
    const roundedRating = Math.ceil(contestRating);
    console.log({
      username: handle,
      name: handle,
      rating: roundedRating,
      rank: contestData.data.userContestRanking.topPercentage + "%",
      problemsSolved: data.solvedProblem,
      EasySolved: data.easySolved,
      MeduimSolved: data.mediumSolved,
      HardSolved: data.hardSolved,
    });
    res.json({
      username: handle,
      name: handle,
      rating: roundedRating,
      rank: contestData.data.userContestRanking.topPercentage + "%",
      problemsSolved: data.solvedProblem,
      EasySolved: data.easySolved,
      MeduimSolved: data.mediumSolved,
      HardSolved: data.hardSolved,
    });
  } catch (err) {
    console.error("Failed to fetch LeetCode data:", err);
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
});

router.get("/api/get-handles", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const result = await db.query(
      "SELECT * FROM user_cp_handles WHERE user_email = $1",
      [email]
    );

    console.log("Handles fetched successfully:");
    // if (result.rows.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No handles found for this user" });
    // }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/api/set-handles", async (req, res) => {
  const { email, codeforces, leetcode, codechef } = req.body;
  console.log("Received request to /api/set-handles with email:", email);

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    // Delete existing handles
    await db.query("DELETE FROM user_cp_handles WHERE user_email = $1", [
      email,
    ]);

    // Insert new handles (single row with all three handles)
    const insertQuery = `
      INSERT INTO user_cp_handles (
        user_email,
        codeforces_handle,
        leetcode_handle,
        codechef_handle
      ) VALUES ($1, $2, $3, $4)
    `;
    await db.query(insertQuery, [email, codeforces, leetcode, codechef]);

    res.status(200).json({ message: "Handles updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to update handles" });
  }
});

router.get("/api/cf/rating", async (req, res) => {
  console.log("Received request to /cf/rating with handle:", req.query);
  const { handle } = req.query; // Use query param like /cf/rating?handle=nagendra_bh
  // console.log("Handle:", handle);
  // console.log(`https://codeforces.com/api/user.rating?handle=${handle}`);

  try {
    const response = await fetch(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );

    // Check if the response is successful
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch Codeforces data" });
    }

    // Parse the JSON response
    const jsonData = await response.json();

    // console.log("Response from Codeforces API:", jsonData);

    if (jsonData.status === "OK") {
      const result = jsonData.result.map((entry) => ({
        contestId: entry.contestId,
        contestName: entry.contestName,
        rating: entry.newRating,
        date: new Date(entry.ratingUpdateTimeSeconds * 1000)
          .toISOString()
          .split("T")[0],
      }));

      return res.status(200).json(result);
    } else {
      return res.status(400).json({ error: "Invalid handle or API error" });
    }
  } catch (error) {
    console.error("Error fetching Codeforces data:", error.message);
    return res.status(500).json({ error: "Failed to fetch Codeforces data" });
  }
});

router.get("/api/cc/rating", async (req, res) => {
  console.log("Received request to /cc/rating with handle:", req.query);
  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({ error: "Missing handle parameter" });
  }

  const apiURL = `https://codechef-api.vercel.app/handle/${handle}`;
  // console.log("Fetching CodeChef data from:", apiURL);

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch CodeChef data" });
    }

    const jsonData = await response.json();
    // console.log("Response from CodeChef API:", jsonData.ratingData);

    if (!jsonData.ratingData || !Array.isArray(jsonData.ratingData)) {
      return res
        .status(400)
        .json({ error: "Invalid data format from CodeChef API" });
    }

    const result = jsonData.ratingData.map((entry) => ({
      name: entry.code,
      date: `${entry.getyear}-${entry.getmonth.padStart(
        2,
        "0"
      )}-${entry.getday.padStart(2, "0")}`,
      rating: entry.rating,
    }));

    // console.log("Formatted CodeChef data:", result);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching CodeChef data:", error.message);
    return res.status(500).json({ error: "Failed to fetch CodeChef data" });
  }
});

router.get("/api/cf-contest-no/" , async (req, res) => {
   const {handle} = req.query;
   console.log("Received request to /api/contest-no with handle:", handle);
    if (!handle) {
      return res.status(400).json({ error: "Handle is required" });
    }
  try{
    const data = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const jsonData = await data.json();
    return res.status(200).json(jsonData.result.length);
  } catch (error) {
    console.error("Error fetching Codeforces data:", error.message);
    return res.status(500).json({ error: "Failed to fetch Codeforces data" });
  }
  
});
router.get("/api/cc-contest-no/" , async (req, res) => {
   const {handle} = req.query;
   console.log("Received request to cc contest-no with handle:", handle);
    if (!handle) {
      return res.status(400).json({ error: "Handle is required" });
    }
  try{
    const data = await fetch(`https://codechef-api.vercel.app/handle/${handle}`);
    const jsonData = await data.json();
    const len = jsonData.ratingData.length;
    console.log("Length of CodeChef contests:", len);
    return res.status(200).json(len);
  } catch (error) {
    console.error("Error fetching CodeChef data:", error.message);
    return res.status(500).json({ error: "Failed to fetch CodeChef data" });
  }
  
});


module.exports = router;
