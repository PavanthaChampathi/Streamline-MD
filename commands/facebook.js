const { cmd } = require('../command');
const config = require('../config');
const fg = require('api-dylux');

cmd({
    pattern: "fbvideo",
    desc: "Download High-Quality Videos From Facebook",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        // Check for input
        if (!q) {
            m.react("❓")
            return reply("🔍 *Please provide a Facebook video URL.*");
        }

        m.react("🎬")

        // Fetch video details from Facebook
        let data = await fg.fbdl(q);
        console.log(data)
        
        // Check if data was retrieved successfully
        if (!data || !data.url) {
            return reply("❌ *Failed to retrieve a download URL.* Please check the Facebook URL.");
        }

        let downloadUrl = data.url; // Video download link
        let videoInfo = data.meta;  // Metadata like title, duration, etc.
        
        const desc = 
`❍⚯────────────────⚯❍𝐒𝐓𝐑𝐄𝐀𝐌𝐋𝐈𝐍𝐄 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍❍⚯────────────────⚯❍

🎥 *Facebook Video Found:*

*Title*: ${videoInfo.title || "N/A"}
*Duration*: ${videoInfo.duration || "N/A"} mins
🔗 *Watch here*: ${q}

${config.BOTTOM_FOOTER}`;

        // Send video with download URL
        await conn.sendMessage(from, { video: { url: downloadUrl }, caption: desc, mimetype: 'video/mp4' }, { quoted: m });

    } catch (e) {
        // Error handling
        console.error(e);
        reply(`❌ *Error*: ${e.message || e.toString()}`);
    }
});
