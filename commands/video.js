const { cmd } = require("../command");
const config = require("../config");
const yts = require("yt-search");
const fg = require("api-dylux");

cmd(
  {
    pattern: "video",
    desc: "Download Videos From YouTube",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      // Number formatting function
      function formatNumber(num) {
        if (num >= 1_000_000) {
          return `${(num / 1_000_000).toFixed(1)}M`;
        } else if (num >= 1_000) {
          return `${(num / 1_000).toFixed(1)}K`;
        } else {
          return num.toString();
        }
      }

      // Check for input
      if (!q) {
        m.react("❓").then(() => {
          reply("🔍 *Please provide a YouTube URL or title to search.*");
        });
        return;
      }

      // Search YouTube for the video
      const search = await yts(q);
      const data = search.videos[0];

      // Handle no results
      if (!data) {
        m.react("❓").then(() => {
          reply(`❌ *Error:* No results found.\n🔗 *Hint:* Please provide a valid URL or title.`);
        });
        return;
      }
      
      m.react("🎬");

      const url = data.url;
      const formattedViews = formatNumber(data.views);

      // Request high-quality video
      let down = await fg.ytv(url, "720p"); // Requesting 720p
      if (!down || !down.dl_url) {
        m.react("❌");
        return reply("❌ *Failed to retrieve a download URL.*");
      }

      let downloadUrl = down.dl_url;

      const desc = `🎥𝗦𝗧𝗥𝗘𝗔𝗠𝗟𝗜𝗡𝗘 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥🎥
   

🔎 *Searching for*: ${q}
🎥 *Found video:*

*Title*: ${data.title}
*Duration*: ${data.timestamp} mins
*Uploaded*: ${data.ago}
*Views*: ${formattedViews}
🔗 *Watch here*: ${url}

${config.BOTTOM_FOOTER}`;

      // Send video with high-quality URL
      await conn.sendMessage(
        from,
        { video: { url: downloadUrl }, caption: desc, mimetype: "video/mp4" },
        { quoted: m }
      );
    } catch (e) {
      // Error handling
      console.error(e);
      m.react("❌");
      reply(`❌ *Error*: ${e}`);
    }
  }
);

