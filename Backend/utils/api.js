const moment = require("moment");

const logFetch = (platform, count) => {
  console.log(`✅ [${platform}] Successfully fetched ${count} contests.`);
};

const logError = (platform, error) => {
  console.error(`❌ [${platform}] Error fetching contests:`, error.message);
};

export const CodeforcesAPI = {
  fetchContests: async () => {
    try {
      const startDate = moment()
        .subtract(3, "weeks")
        .format("YYYY-MM-DD HH:mm");
      const endDate = moment().add(3, "weeks").format("YYYY-MM-DD HH:mm");

      const url = `https://clist.by/api/v1/contest/?resource__name=codeforces.com&start__gt=${encodeURIComponent(
        startDate
      )}&start__lt=${encodeURIComponent(endDate)}&order_by=start&username=${
        process.env.CLIST_USERNAME
      }&api_key=${process.env.CLIST_API_KEY}`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Failed to fetch contests from Codeforces");

      const data = await response.json();
      const contests = data.objects.map((contest) => ({
        id: contest.id,
        name: contest.event,
        startTime: new Date(contest.start).getTime() / 1000,
        endTime: new Date(contest.end).getTime() / 1000,
        platform: "Codeforces",
        href: contest.href,
        duration: contest.duration,
      }));

      logFetch("Codeforces", contests.length);
      return contests;
    } catch (error) {
      logError("Codeforces", error);
      return [];
    }
  },
};

export const CodechefAPI = {
  fetchContests: async () => {
    try {
      const startDate = moment()
        .subtract(3, "weeks")
        .format("YYYY-MM-DD HH:mm");
      const endDate = moment().add(3, "weeks").format("YYYY-MM-DD HH:mm");

      const url = `https://clist.by/api/v1/contest/?resource__name=codechef.com&start__gt=${encodeURIComponent(
        startDate
      )}&start__lt=${encodeURIComponent(endDate)}&order_by=start&username=${
        process.env.CLIST_USERNAME
      }&api_key=${process.env.CLIST_API_KEY}`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Failed to fetch contests from CodeChef");

      const data = await response.json();
      const contests = data.objects.map((contest) => ({
        id: contest.id,
        name: contest.event,
        startTime: new Date(contest.start).getTime() / 1000,
        endTime: new Date(contest.end).getTime() / 1000,
        platform: "CodeChef",
        href: contest.href,
        duration: contest.duration,
      }));

      logFetch("CodeChef", contests.length);
      return contests;
    } catch (error) {
      logError("CodeChef", error);
      return [];
    }
  },
};

export const LeetcodeAPI = {
  fetchContests: async () => {
    try {
      const startDate = moment()
        .subtract(5, "weeks")
        .format("YYYY-MM-DD HH:mm");
      const endDate = moment().add(5, "weeks").format("YYYY-MM-DD HH:mm");

      const url = `https://clist.by/api/v1/contest/?resource__name=leetcode.com&start__gt=${encodeURIComponent(
        startDate
      )}&start__lt=${encodeURIComponent(endDate)}&order_by=start&username=${
        process.env.CLIST_USERNAME
      }&api_key=${process.env.CLIST_API_KEY}`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Failed to fetch contests from LeetCode");

      const data = await response.json();
      const contests = data.objects.map((contest) => ({
        id: contest.id,
        name: contest.event,
        startTime: new Date(contest.start).getTime() / 1000,
        endTime: new Date(contest.end).getTime() / 1000,
        platform: "LeetCode",
        href: contest.href,
        duration: contest.duration,
      }));

      logFetch("LeetCode", contests.length);
      return contests;
    } catch (error) {
      logError("LeetCode", error);
      return [];
    }
  },
};
