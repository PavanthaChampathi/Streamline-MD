const { cmd, commands } = require("../command");
const config = require("../config");
const yts = require("yt-search");
const fg = require("api-dylux");

cmd(
  {
    pattern: "song",
    desc: "Download Songs From YouTube",
    category: "download",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      // Function to format numbers
      function formatNumber(num) {
        if (num >= 1_000_000) {
          return `${(num / 1_000_000).toFixed(1)}M`;
        } else if (num >= 1_000) {
          return `${(num / 1_000).toFixed(1)}K`;
        } else {
          return num.toString();
        }
      }

      if (!q) {
        m.react("❓").then(() => {
          reply("🔍 *Please provide a YouTube URL or title to search.*");
        });
        return;
      }
      const search = await yts(q);
      const data = search.videos[0];

      if (!data) {
        m.react("❓").then(() => {
          reply(
            `❌ *Error:* No results found.\n🔗 *Hint:* Please provide a valid URL or title.`
          );
        });
        return;
      }

      const url = data.url;

      const formattedViews = formatNumber(data.views);
      const qser = q.startsWith("https://") ? q : `*_${q.toUpperCase()}_*`;
      // Download video
      let down = await fg.yta(url);
      if (!down || !down.dl_url)
        return reply("Failed to get the download URL.");

      let downloadUrl = down.dl_url;

      const desc = 
`🎥𝗦𝗧𝗥𝗘𝗔𝗠𝗟𝗜𝗡𝗘 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥🎥
   
🔎 *Searching for*: ${q}
🎥 *Found video:*

*Title*: ${data.title}
*Duration*: ${data.timestamp} mins
*Uploaded*: ${data.ago}
*Views*: ${formattedViews}
🔗 *Watch here*: ${url}

${config.BOTTOM_FOOTER}`;

      m.react("🎵");
      const songMessage = await conn.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: desc },
        { quoted: mek }
      );
      await conn.sendMessage(
        from,
        { audio: { url: downloadUrl }, mimetype: "audio/mp4", ptt: true },
        { quoted: m }
      );
    } catch (e) {
      console.error(e);
      reply(`${e}`);
    }
  }
);
