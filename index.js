import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Replace this with your Discord webhook
const DISCORD_WEBHOOK = "YOUR_DISCORD_WEBHOOK_URL";

// Handle GitHub Webhook events
app.post("/github", async (req, res) => {
  try {
    const payload = req.body;

    const repoName = payload.repository?.full_name || "Unknown Repo";
    const repoUrl = payload.repository?.html_url || "";

    // If no commits, ignore
    if (!payload.commits || payload.commits.length === 0) {
      return res.status(200).send("No commits found");
    }

    // Create embed for each commit
    const embeds = payload.commits.map((commit) => ({
      title: `📌 Commit in ${repoName}`,
      url: commit.url,
      description: `**${commit.message}**`,
      color: 0x00ff00, // Green
      fields: [
        { name: "Author", value: commit.author?.name || "Unknown", inline: true },
        { name: "Repository", value: `[${repoName}](${repoUrl})`, inline: true }
      ],
      timestamp: new Date(commit.timestamp)
    }));

    // Send to Discord
    await axios.post(DISCORD_WEBHOOK, {
      username: "GitHub Notifier",
      embeds: embeds
    });

    res.status(200).send("Notification sent to Discord");
  } catch (err) {
    console.error("Error sending to Discord:", err.message);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
