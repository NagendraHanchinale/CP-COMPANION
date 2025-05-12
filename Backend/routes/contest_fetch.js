const express = require("express");
const router = express.Router();
const db = require("../db");

console.log(`Contest_fetch.js is running.....`);

// Route: GET /contestsList/get?platform=Codeforces
router.get("/get", async (req, res) => {
  const { platform } = req.query;

  try {
    let query = "SELECT * FROM contests";
    let values = [];

    if (platform) {
      query += " WHERE platform = $1";
      values.push(platform);
    }

    query += " ORDER BY start_time ASC";

    const result = await db.query(query, values);

    res.status(200).json({ success: true, contests: result.rows });
  } catch (error) {
    console.error("Error fetching contests:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
