const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const config = require('../config');
const yts = require('yt-search');
const fg = require('api-dylux');

const menuMessageIds = new Map(); // Track the message IDs to check replies

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
`🌐 Streamline-MD 🌟
🎧 YT SEARCH 🎬 
    
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
        menuMessageIds.set(from, searchMessage.key.id); // Save the message ID to check replies

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

        // Handle the user's choice for downloading audio/video based on the reply
        switch (selectedOption) {
            case 1:
                // Handle Audio download
                reply("🎶 Downloading Audio...");
                let audio = await fg.yta(m.quoted.body); // Download audio
                if (audio && audio.dl_url) {
                    await conn.sendMessage(from, { document: { url: audio.dl_url }, mimetype: 'audio/mpeg', caption: "Here's your audio file!" }, { quoted: m });
                } else {
                    reply("Failed to download audio.");
                }
                break;

            case 2:
                // Handle Video download
                reply("🎬 Downloading Video...");
                let video = await fg.ytv(m.quoted.body); // Download video
                if (video && video.dl_url) {
                    await conn.sendMessage(from, { document: { url: video.dl_url }, mimetype: 'video/mp4', caption: "Here's your video file!" }, { quoted: m });
                } else {
                    reply("Failed to download video.");
                }
                break;

            case 3:
                // Handle Audio Document
                reply("🎵 Preparing Audio Doc...");
                let audioDoc = await fg.yta(m.quoted.body); // Get audio for doc
                if (audioDoc && audioDoc.dl_url) {
                    await conn.sendMessage(from, { document: { url: audioDoc.dl_url }, mimetype: 'audio/mpeg', caption: "Here's your audio document!" }, { quoted: m });
                } else {
                    reply("Failed to prepare audio document.");
                }
                break;

            case 4:
                // Handle Video Document
                reply("📹 Preparing Video Doc...");
                let videoDoc = await fg.ytv(m.quoted.body); // Get video for doc
                if (videoDoc && videoDoc.dl_url) {
                    await conn.sendMessage(from, { document: { url: videoDoc.dl_url }, mimetype: 'video/mp4', caption: "Here's your video document!" }, { quoted: m });
                } else {
                    reply("Failed to prepare video document.");
                }
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

