export const ContestAPI = {
  fetchContests: async (platform = null) => {
    try {
      // Construct the backend URL
      let url = "http://localhost:3000/contestsList/get"; // Update port if needed
      if (platform) {
        url += `?platform=${encodeURIComponent(platform)}`;
      }
      console.log(url);

      // Fetch from backend
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch contests from ${platform || "server"}`
        );
      }

      const data = await response.json();
      console.log(`[${platform || "All"}] Contests Fetched:`, data.contests);

      return data.contests.map((contest) => ({
        id: contest.id,
        name: contest.name,
        startTime: contest.start_time,
        endTime: contest.end_time,
        platform: contest.platform,
        href: contest.href,
        duration: contest.duration,
      }));
    } catch (error) {
      console.error(`Error fetching contests for ${platform || "All"}:`, error);
      throw error;
    }
  },
};
