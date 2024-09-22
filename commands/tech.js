const axios = require('axios');
const { cmd, commands } = require('../command');

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
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=dfbd2f651f3046bab3d1f7f3dfe8a0ea`);
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