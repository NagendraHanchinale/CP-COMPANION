const cron = require("node-cron");
const axios = require("axios");
const db = require("../db");

const platforms = ["codeforces.com", "codechef.com", "leetcode.com"];
const platformMap = {
  "codeforces.com": "Codeforces",
  "codechef.com": "CodeChef",
  "leetcode.com": "LeetCode",
};

console.log(`Contest Fetching server is working ............`);

const fetchContests = async (resource) => {
  const now = new Date();
  const startDate = new Date(
    now.getTime() - 10 * 24 * 60 * 60 * 1000
  ).toISOString(); // 7 days ago
  const endDate = new Date(
    now.getTime() + 10 * 24 * 60 * 60 * 1000
  ).toISOString(); // 7 days ahead

  const url = `https://clist.by/api/v1/contest/?resource__name=${resource}&start__gt=${encodeURIComponent(
    startDate
  )}&start__lt=${encodeURIComponent(endDate)}&order_by=start&username=${
    process.env.CLIST_USERNAME
  }&api_key=${process.env.CLIST_API_KEY}`;

  try {
    const res = await axios.get(url);
    return res.data.objects.map((contest) => ({
      id: contest.id,
      name: contest.event,
      start_time: Math.floor(new Date(contest.start).getTime() / 1000),
      end_time: Math.floor(new Date(contest.end).getTime() / 1000),
      platform: platformMap[resource],
      href: contest.href,
      duration: contest.duration,
    }));
  } catch (err) {
    console.error(`Error fetching ${resource} contests:`, err.message);
    return [];
  }
};

const updateContests = async () => {
  console.log(`[${new Date().toISOString()}] Starting daily contest sync...`);

  try {
    await db.query("DELETE FROM contests"); // Clear old contests
    console.log("Old contest data cleared.");

    for (const resource of platforms) {
      const contests = await fetchContests(resource);

      for (const c of contests) {
        await db.query(
          `INSERT INTO contests (id, name, start_time, end_time, platform, href, duration)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            c.id.toString(),
            c.name,
            c.start_time,
            c.end_time,
            c.platform,
            c.href,
            c.duration,
          ]
        );
      }

      console.log(
        `[${new Date().toISOString()}] Inserted ${
          contests.length
        } contests for ${platformMap[resource]}`
      );
    }

    console.log("✅ Contest data updated successfully.");
  } catch (err) {
    console.error("❌ Error updating contests:", err.message);
  }
};

// Schedule it to run daily at 2 AM
cron.schedule("0 2 * * *", updateContests);

// Uncomment to test immediately
// updateContests();

module.exports = updateContests;
