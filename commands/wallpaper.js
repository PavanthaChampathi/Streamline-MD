const fetch = require('node-fetch');
const { cmd, commands } = require('../command');
const config = require('../config');
const { filterKeywords } = require('../lib/keywordFilter');

//========================================== Wallpaper ==============================================
cmd({
    pattern: "wallpaper",
    desc: "Get wallpapers to personalize your screen.",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
        if (filterKeywords(q)) {
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