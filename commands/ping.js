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
        const start = new Date().getTime();
        await m.react('⚡');
        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        reply(`🔥 ℬ𝓞𝑇 𝓢𝓟𝓔𝓔𝓓:  ${responseTime.toFixed(2)} ꌗ`)

    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
