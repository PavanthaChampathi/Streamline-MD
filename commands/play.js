const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const config = require('../config');
const yts = require('yt-search');
const fg = require('api-dylux');

const menuMessageIds = new Map(); // Track the message IDs to check replies
const downloadUrls = new Map(); // Store download data (e.g., URLs) for each conversation

// Helper function to format numbers for views
const formatNumber = (num) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
};

// Play command handler
cmd({
    pattern: "play",
    desc: "Play or download a song or a video",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        if (!q) {
            m.react("❓");
            return reply(`🔍 *Please provide a URL or title.*\n🌐 *Example:* https://example.com or "Sample Title"`);
        }

        // Perform YouTube search
        const search = await yts(q);
        const data = search.videos[0];

        if (!data) {
            m.react("❓");
            return reply(`❌ *Error:* No results found.\n🔗 *Hint:* Please provide a valid URL or title.`);
        }

        m.react("📺");

        // Extract video details
        const url = data.url;
        const formattedViews = formatNumber(data.views);
        const qser = q.startsWith('https://') ? q : `*_${q.toUpperCase()}_*`;

        // Build the description
        const desc = 
`🎥𝗦𝗧𝗥𝗘𝗔𝗠𝗟𝗜𝗡𝗘 𝗦𝗢𝗡𝗚 & 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥🎥
    
🔎 Searching for: ${qser}
🎥 Here’s what I found:
    
Title       : ${data.title}
Time        : ${data.timestamp}m
Ago         : ${data.ago}
Views       : ${formattedViews}

🔗 Watch it here: ${url}

To Get The Files Send:
1 🎶 For Audio
2 🎬 For Video
3 🎵 For Audio Doc
4 📹 For Video Doc 
           
${config.BOTTOM_FOOTER}`;

        // Send message with search result and track its ID
        const searchMessage = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        downloadUrls.set(from, url);

        menuMessageIds.set(from, searchMessage.key.id);

    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

// Reply handler for Play command
cmd({
    on: "body"
}, async (conn, mek, m, { from, body, reply }) => {
    try {
        const menuMessageId = menuMessageIds.get(from); // Get the tracked message ID
        if (!m.quoted || m.quoted.id !== menuMessageId) return; // Only proceed if reply matches the tracked message ID

        const selectedOption = parseInt(body); // Convert reply body to an integer
        if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > 4) {
            return reply("Please enter a valid number between 1 and 4.");
        }

        // Retrieve the stored download data for this conversation
        const dataurl = downloadUrls.get(from);
        if (!dataurl) return reply("No download data available.");

        let downa = await fg.yta(dataurl);
        if (!downa || !downa.dl_url) return reply("Failed to download audio.");

        let downv = await fg.ytv(dataurl);
        if (!downv || !downv.dl_url) return reply("Failed to download video.");

        // Handle the user's choice for downloading audio/video based on the reply
        switch (selectedOption) {
            case 1:
                reply("🎶 Downloading Audio...");
                await conn.sendMessage(from, { audio: { url: downa.dl_url }, mimetype: 'audio/mpeg', }, { quoted: m });
                break;

            case 2:
                reply("🎬 Downloading Video...");
                await conn.sendMessage(from, { video: { url: downv.dl_url }, mimetype: 'video/mp4', caption: "Here's your video file!" }, { quoted: m });
                break;

            case 3:
                reply("🎵 Preparing Audio Doc...");
                await conn.sendMessage(from, { document: { url: downa.dl_url }, mimetype: "audio/mpeg" , fileName:downa.title+".mp3"},{ quoted: mek });
                break;

            case 4:
                reply("📹 Preparing Video Doc...");
                await conn.sendMessage(from, { document: { url: downv.dl_url }, mimetype: "video/mp4" , fileName:downv.title+".mp4"},{ quoted: mek });
                break;

            default:
                reply("Please enter a valid option.");
                break;
        }

    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});
