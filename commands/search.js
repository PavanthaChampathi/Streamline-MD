const { cmd, commands } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const wiki = require('wikipedia').default;
const axios = require('axios');
const fetch = require('node-fetch');
const { OpenAI } = require("openai");
const yts = require('yt-search');
const fg = require('api-dylux');

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

//=========================================== WikiPidia =============================================
cmd({
    pattern: "wiki",
    desc: "Search and retrieve information from Wikipedia.",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (containsRestrictedKeyword(q)) {
            await m.react("🚫");
            return reply("🚫 Access Denied: Your request contains restricted keywords.");
        }

        if (!q) {
            await m.react("❓");
            return reply("Please provide a search term.");
        }

        const searchResult = await wiki.search(q);

        if (!searchResult || searchResult.results.length === 0) {
            await m.react("😕");
            return reply("No definitions found for *${qu}*.");
        }

        const pageTitle = searchResult.results[0].title;
        const page = await wiki.page(pageTitle);
        const summary = await page.summary();
        const pageUrl = page.fullurl;

        if (!summary) {
            await m.react("😔");
            return reply(`😔 No summary available for this article.\n🔗 You can view the full page here: ${pageUrl}`);
        }

        await m.react("📖");

        const qu = q.toUpperCase();

        let summarym = 
`🌐 Streamline-MD 🌟
🔍 WIKIPIDIA SEARCH 📖


🔗 Searching for:  *_${qu}_*

📖 Here’s what I found: \n\n*${summary.extract}*

🔗 Read more: ${pageUrl}

${config.BOTTOM_FOOTER}`

        reply(summarym);
    } catch (e) {
        await m.react("⚠️");
        console.log(e);
        reply(`${e}`);
    }
});

//===================================================================================================

//========================================== Wallpaper ==============================================
cmd({
    pattern: "wallpaper",
    desc: "Get wallpapers to personalize your screen.",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
        if (containsRestrictedKeyword(q)) {
            await m.react("🚫");
            return reply("🚫 Access Denied: Your request contains restricted keywords.");
        }

        await m.react('🖼️');

        const apiKey = "Xj7DNsUwRsEhPj1OeNOOkIK2IQ7CBIiurCVKliRUVF4";
        const query = q || "nature";
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&order_by=downloads&client_id=${apiKey}`;

        const response = await fetch(url);
        const json = await response.json();

        if (json && json.results && json.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * json.results.length);
            const wallpaper = json.results[randomIndex];
            const imageUrl = wallpaper.urls.full;
            const caption = 
`Here’s a wallpaper for you: ${query}

${config.BOTTOM_FOOTER}`;

            await conn.sendMessage(from, { image: { url: imageUrl }, caption: caption }, { quoted: mek });            
        } else {
            reply("Sorry, I couldn't find any wallpapers.");
        }
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//=================================================================================================

//========================================== Tech =================================================

cmd({
    pattern: "tech",
    desc: "Get the latest updates on technology.",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {

        let numberOfArticles = 5;

        // Check if a value is provided and validate it
        if (args.length > 0) {
            let userValue = parseInt(args[0]);
            if (!isNaN(userValue) && userValue >= 1 && userValue <= 15) {
                numberOfArticles = userValue;
            } else {
                reply('Please provide a number between 1 and 15.');
                return;
            }
        }
        
        m.react("📲")
        const apiKey = "dfbd2f651f3046bab3d1f7f3dfe8a0ea"; // Replace with your actual API key
        const response = await axios.get(`https://newsapi.org/v2/everything?q=tech&apiKey=dfbd2f651f3046bab3d1f7f3dfe8a0ea`);
        const news = response.data.articles;
        
        if (news.length === 0) {
            reply('No recent tech news found.');
            return;
        }
        
        let message = `🔧 TECH INFO:\n📰 Number of articles:${numberOfArticles}\n🔍 Fetching the latest tech updates and insights...\n📈 Stay tuned for the latest trends and innovations!\n\n`;
        news.slice(0, numberOfArticles).forEach((article, index) => {
            message += `${index + 1}. ${article.title}\n   ${article.url}\n\n`;
        });
        
        reply(message);
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

//=================================================================================================

//========================================== YT Search ============================================

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


//=================================================================================================

//========================================== Define ===============================================

cmd({
    pattern: "define",
    desc: "Look up definitions and meanings from the dictionary.",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {

        if (containsRestrictedKeyword(q)) {
            await m.react("🚫");
            return reply("🚫 Access Denied: Your request contains restricted keywords.");
        }

        if (!q){
            await m.react("❓");
            return reply("Please provide a search term.");
        }

        const word = q.trim().toLowerCase();
        const apiKey = "9501c7c3-7d02-42a1-a6ff-65eb0f4bfffb";
        const url = `https://dictionaryapi.com/api/v3/references/learners/json/${q}?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();
        const qu = q.toUpperCase();

        if (data.length > 0 && typeof data[0] === 'object') {
            let definition = data[0].shortdef ? data[0].shortdef.join('; ') : 'No definition available';
            let pageUrl = `https://www.merriam-webster.com/dictionary/${encodeURIComponent(word)}`;

            const responseMessage = 
`🌐 *Streamline-MD* 🌟
🔍 *DICTIONARY SEARCH* 📖

🔗 *Searching for:*  *_${qu}_*

📖 *Here’s what I found:* \n\n*${definition}*

🔗 *Read more:* ${pageUrl}

${config.BOTTOM_FOOTER}`;
            reply(responseMessage);
        } else {
            await m.react("😕");
            reply(`No definitions found for *${qu}*.`);
        }
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});


//=================================================================================================
