const { cmd } = require('../command');
const config = require('../config');
const fg = require('api-dylux');

cmd({
    pattern: "fb",
    alias: ["fbvideo", "fbdl"],
    desc: "Download Videos From Facebook",
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
        let data = await fg.fbdl(q)
        
        // Check if data was retrieved successfully
        if (!data || !data.videoUrl) {
            m.react("❌")
            .than()( reply("❌ *Failed to retrieve a download URL.* Please check the Facebook URL."))
            return ;
        }

        let downloadUrl = data.videoUrl; // Video download link
        
        const desc = `${config.BOTTOM_FOOTER}`;

        // Send video with download URL
        await conn.sendMessage(from, { video: { url: downloadUrl }, caption: desc, mimetype: 'video/mp4' }, { quoted: m });

    } catch (e) {
        // Error handling
        console.error(e);
        m.react("❌")
        reply(`❌ *Error*: ${e}`);
    }
});
