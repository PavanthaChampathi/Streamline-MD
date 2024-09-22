const wiki = require('wikipedia').default;
const { cmd, commands } = require('../command');
const { filterKeywords } = require('../lib/keywordFilter');
const config = require('../config');

//=========================================== WikiPidia =============================================
cmd({
    pattern: "wiki",
    desc: "Search and retrieve information from Wikipedia.",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (filterKeywords(q)) {
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