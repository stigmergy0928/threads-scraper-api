import express from "express";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const app = express();

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Threads Scraper API is running"
  });
});

app.get("/threads", async (req, res) => {
  const username = req.query.username;
  const limit = req.query.limit || "5";

  if (!username) {
    return res.status(400).json({
      error: "username is required"
    });
  }

  try {
    const { stdout } = await execFileAsync(
      "./th",
      [
        "profile",
        username,
        "--posts",
        "-n",
        String(limit),
        "-o",
        "json"
      ],
      {
        timeout: 60000,
        maxBuffer: 10 * 1024 * 1024
      }
    );

    const data = JSON.parse(stdout);

    res.json({
      success: true,
      username,
      posts: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stderr: error.stderr || ""
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
