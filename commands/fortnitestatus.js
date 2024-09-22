const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "fortnite",
    desc: "Get Fortnite BR player stats.",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a Fortnite username.");

        const username = q
        const apiKey = 'Yb8812ed8-0e10-4da3-8188-7ca4fa294612'; // Replace with your actual API key
        const apiUrl = `https://fortnite-api.com/v2/stats/br/v2?name=${username}&accountType=epic&timeWindow=lifetime&api=${apiKey}`;

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `ApiKey ${apiKey}`
            }
        });

        const playerStats = response.data;
        const stats = playerStats.data.stats; // Adjust based on the API response structure
        
        // Extract the relevant data
        const wins = stats.wins || 'N/A';
        const kills = stats.kills || 'N/A';
        const matches = stats.matches || 'N/A';

        reply(`🎮 **Fortnite Stats for ${username}:**
- 🏆 **Wins:** ${wins}
- 🔫 **Kills:** ${kills}
- 🏅 **Matches Played:** ${matches}`);
    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
