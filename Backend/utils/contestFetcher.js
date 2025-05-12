// const { CodeforcesAPI, CodechefAPI, LeetcodeAPI } = require("./api");
// const db = require("../db");
// const moment = require("moment");

// const fetchAndStoreContests = async () => {
//   try {
//     const contests = [
//       ...(await CodeforcesAPI.fetchContests()),
//       ...(await CodechefAPI.fetchContests()),
//       ...(await LeetcodeAPI.fetchContests()),
//     ];

//     for (const contest of contests) {
//       const id = contest.id.toString(); // Ensure ID is string
//       const exists = await db.query("SELECT 1 FROM contests WHERE id = $1", [
//         id,
//       ]);

//       if (exists.rowCount === 0) {
//         await db.query(
//           `INSERT INTO contests (id, name, start_time, end_time, platform, href, duration)
//            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
//           [
//             id,
//             contest.name,
//             contest.startTime,
//             contest.endTime,
//             contest.platform,
//             contest.href,
//             contest.duration,
//           ]
//         );
//         console.log(`Inserted: ${contest.name}`);
//       } else {
//         console.log(`Already exists: ${contest.name}`);
//       }
//     }

//     console.log(
//       `[${moment().format()}] Finished fetching and storing contests.`
//     );
//   } catch (err) {
//     console.error("Error in fetchAndStoreContests:", err);
//   }
// };

// module.exports = fetchAndStoreContests;
