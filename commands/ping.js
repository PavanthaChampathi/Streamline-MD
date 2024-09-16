const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const start = new Date().getTime(); // Record start time
        await m.react("⏳");
        const end = new Date().getTime(); // Record end time

        const responseTime = end - start; // Response time in milliseconds
        // Send the formatted message
        m.react("📍")
        //.than conn.sendMessage(from, { text: `📍 Pong ${responseTime} Ms` }, { quoted: mek });
        .then(() => reply(`📍 Pong ${responseTime} Ms`))
    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
