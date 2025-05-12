const express = require("express");
const axios = require("axios");

const router = express.Router();

// Array of playlist IDs
const playlists = [
  "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB", // Playlist 1
  "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr", // Playlist 2
  "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr", // Playlist 3
];

// Endpoint to fetch videos from playlists
router.get("/solutions", async (req, res) => {
  try {
    const videos = [];

    // Fetch videos from each playlist
    for (let playlistId of playlists) {
      console.log(`yt solution: ${playlistId}`);
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: {
            part: "snippet",
            playlistId: playlistId,
            maxResults: 5, // Fetch the latest 5 videos
            key: process.env.YOUTUBE_API_KEY, // Use your API key from .env
          },
        }
      );
      console.log(response.data.items);

      const videoData = response.data.items
        .filter(
          (item) =>
            item.snippet?.resourceId?.videoId &&
            item.snippet?.thumbnails &&
            item.snippet.title !== "Private video" &&
            item.snippet.title !== "Deleted video"
        )
        .map((item) => ({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          thumbnailUrl:
            item.snippet.thumbnails?.medium?.url ||
            item.snippet.thumbnails?.default?.url ||
            item.snippet.thumbnails?.high?.url ||
            "",
        }));

      // Push fetched videos into the videos array
      videos.push(...videoData);
    }

    // Return the list of videos
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

module.exports = router;
