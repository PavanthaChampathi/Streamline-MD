const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "githubstalk",
    desc: "Fetch detailed GitHub user profile including profile picture.",
    category: "other",
    react: "🖥️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("Please provide a GitHub username.");
        }

        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        let userInfo = `   🔍❯═─┈•*STREAMLINE  GITHUB SERCH*──═❮_🔎
        
👤 *USERNAME*: ${data.name || data.login}
🔗 *GIT URL*:(${data.html_url})
📝 *BIO*: ${data.bio || 'Not available'}
🏙️ *LOCATION*: ${data.location || 'Unknown'}
📊 *PUBLIC REPOS*: ${data.public_repos}
👥 *FOLLOWERS*: ${data.followers} | Following: ${data.following}
📅 *CREATED ARTS*: ${new Date(data.created_at).toDateString()}
🔭 *GISTS*: ${data.public_gists}
╰────────────────────────────────────────────❃

*©STREAMLINE *
`;

        await conn.sendMessage(from, { image: { url: data.avatar_url }, caption: userInfo }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`ERROR..: ${e.response ? e.response.data.message : e.message}`);
    }
});
