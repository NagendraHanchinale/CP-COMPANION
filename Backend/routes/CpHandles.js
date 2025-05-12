const express = require("express");
const router = express.Router();
const db = require("../db"); // your database connection

// GET /api/profile/getHandles
router.get("/getHandles", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const { rows } = await db.query(
      `SELECT codeforces_handle, leetcode_handle, codechef_handle
         FROM user_handles
         WHERE username_email = $1
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Handles not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/profile/updateHandles
router.post("/updateHandles", async (req, res) => {
  const { email, codeforces, leetcode, codechef } = req.body;
  console.log("update handles...");
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    await db.query(
      `INSERT INTO user_handles (username_email, codeforces_handle, leetcode_handle, codechef_handle)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username_email) 
       DO UPDATE SET 
         codeforces_handle = EXCLUDED.codeforces_handle,
         leetcode_handle = EXCLUDED.leetcode_handle,
         codechef_handle = EXCLUDED.codechef_handle
      `,
      [email, codeforces, leetcode, codechef]
    );

    res.status(200).json({ message: "Handles updated successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
