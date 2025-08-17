import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/XXXXXXXXX/YYYYYYYYYY"; // <-- your Discord webhook

app.get("/", (req, res) => res.send("✅ GitHub → Discord Webhook is running!"));

app.post("/github", async (req, res) => {
  try {
    const body = req.body;

    if (body.commits && body.commits.length > 0) {
      for (const commit of body.commits) {
        const message =
          `📢 **New Commit in ${body.repository.full_name}**\n` +
          `📝 ${commit.message}\n` +
          `👤 ${commit.author.name}\n` +
          `🔗 ${commit.url}`;

        await axios.post(DISCORD_WEBHOOK, {
          content: message,
        });
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error sending to Discord:", error.message);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
