const fetch = require('node-fetch');
const { cmd, commands } = require('../command');
const config = require('../config');
const { filterKeywords } = require('../lib/keywordFilter');


//========================================== Define ===============================================

cmd({
    pattern: "define",
    desc: "Look up definitions and meanings from the dictionary.",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {

        if (filterKeywords(q)) {
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