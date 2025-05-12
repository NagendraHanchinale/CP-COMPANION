const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();
const db = require("./db");

app.use(express.json());

// Allow CORS (required for frontend dev)
const cors = require("cors");
app.use(cors());

app.use("/users", require("./routes/users"));
require("./models/cronJob");
app.use("/contestsList", require("./routes/contest_fetch"));
app.use("/get", require("./routes/YtSolution"));
app.use("/api", require("./routes/CpHandles"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
