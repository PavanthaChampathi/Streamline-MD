const { cmd, commands } = require('../command');
const config = require('../config');
const yts = require('yt-search');
const fg = require('api-dylux');

cmd({
    pattern: "song",
    desc: "Download Songs From YouTube",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
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

        const promptMessage = `🔍 *Please provide a URL or title.*\n🌐 *Example:* https://www.youtube.com or "New Phonk"`;
        
        if (!q) {
            m.react("❓");
            return reply(promptMessage);
        }

        const search = await yts(q);
        const data = search.videos[0];

        const errorMessage = `❌ *Error:* No results found.\n🔗 *Hint:* Please provide a valid URL or title.`;
        if (!data) {
            m.react("❓");
            return reply(errorMessage);
        }

        const url = data.url;
        
        const formattedViews = formatNumber(data.views);
        const qser = q.startsWith('https://') ? q : `*_${q.toUpperCase()}_*`;
        // Download video
        let down = await fg.yta(url);
        console.log(down);
        if (!down || !down.dl_url) return reply("Failed to get the download URL.");
        
        let downloadUrl = down.dl_url;

        const desc = 
`🎧𝗦𝗧𝗥𝗘𝗔𝗠𝗟𝗜𝗡𝗘 𝗦𝗢𝗡𝗚 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥🎧  

🔎 Searching for: ${qser}
🎥 Here’s what I found:
┌───────────────────>
│✑Title       : ${data.title}
│✑Time        : ${data.timestamp}m
│✑Ago         : ${data.ago}
│✑Views       : ${formattedViews}
🔗 Watch it here: ${url}

📢 The voice message will be sent automatically.

${config.BOTTOM_FOOTER}`;

        m.react("🎵");
        const songMessage = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });
        await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: m })
 
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});
