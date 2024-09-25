const { cmd } = require('../command');
const config = require('../config');
const yts = require('yt-search');
const fg = require('api-dylux');

cmd({
    pattern: "video",
    desc: "Download High-Quality Videos From YouTube",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
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
            m.react("❓")
            return reply("🔍 *Please provide a YouTube URL or title to search.*");
        }

        // Search YouTube for the video
        const search = await yts(q);
        const data = search.videos[0];
        
        // Handle no results
        if (!data) {
            m.react("❓")
            return reply("❌ *No video found.* Please check the URL or search query.");
        }

        m.react("🎬")

        const url = data.url;
        const formattedViews = formatNumber(data.views);

        // Request high-quality video
        let down = await fg.ytv(url, '720p'); // Requesting 720p
        console.log(down)
        if (!down || !down.dl_url) {
            return reply("❌ *Failed to retrieve a high-quality download URL.*");
        }

        let downloadUrl = down.dl_url;

        const desc = 
`❍⚯────────────────⚯❍𝐒𝐓𝐑𝐄𝐀𝐌𝐋𝐈𝐍𝐄 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍❍⚯────────────────⚯❍
   

🔎 *Searching for*: ${q}
🎥 *Found video:*

*Title*: ${data.title}
*Duration*: ${data.timestamp} mins
*Uploaded*: ${data.ago}
*Views*: ${formattedViews}
🔗 *Watch here*: ${url}

${config.BOTTOM_FOOTER}`;

        // Send video with high-quality URL
        await conn.sendMessage(from, { video: { url: downloadUrl }, caption: desc, mimetype: 'video/mp4' }, { quoted: m });

    } catch (e) {
        // Error handling
        console.error(e);
        reply(`❌ *Error*: ${e.message || e.toString()}`);
    }
});
