const { cmd, commands } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');
//const wiki = require('wikipedia').default;
const axios = require('axios');
const fetch = require('node-fetch');
const yts = require('yt-search');
//const fg = require('api-dylux');

(async () => {
    const fetch = (await import('node-fetch')).default;
})();

// Load restricted keywords from JSON
const keywordsFilePath = path.join(__dirname, '../my_data/restricted_keywords.json');

let restrictedKeywords = [];

const loadRestrictedKeywords = () => {
    try {
        const data = fs.readFileSync(keywordsFilePath, 'utf8');
        const json = JSON.parse(data);
        restrictedKeywords = json.bannedwords || [];
    } catch (error) {
        console.error("Error loading restricted keywords:", error);
    }
};

loadRestrictedKeywords();

const containsRestrictedKeyword = (text) => {
    return restrictedKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
};




//========================================== YT Search ============================================
/*
cmd({
    pattern: "yts",
    desc: "Search on YouTube.",
    category: "search",
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

        // Prompt message for missing query
        const promptMessage = `
🔍 *Please provide a URL or title.*
🌐 *Example:* https://example.com or "Sample Title"
`;

        if (!q) {
            m.react("❓");
            return reply(promptMessage);
        }

        // Perform the YouTube search
        const search = await yts(q);
        const data = search.videos[0];

        // Error message for no results
        const errorMessage = `
❌ *Error:* No results found.
🔗 *Hint:* Please provide a valid URL or title.
`;

        if (!data) {
            m.react("❓");
            return reply(errorMessage);
        }

        // Extracting details and formatting the view count
        const url = data.url;
        const formattedViews = formatNumber(data.views);
        const qser = q.startsWith('https://') ? q : `*_${q.toUpperCase()}_*`;

        // Constructing the description message
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
        
${config.BOTTOM_FOOTER}`;

        // Send the message with image and caption
        m.react("📺");
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });
        let down = await fg.yta(url); // Await the promise returned by fg.yta
        if (!down || !down.dl_url) return reply("Failed to get the download URL.");

    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});

*/
//=================================================================================================
