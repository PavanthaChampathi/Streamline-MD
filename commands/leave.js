const { readEnv } = require('../lib/database');
const { cmd, commands } = require('../command');

cmd({
    pattern: "leave",
    alias: ["exit", "left"],
    desc: "Bot leaves from a group",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        
        if(!isOwner){
            m.react("⛔")
            .then(() => reply("⛔ *THIS IS AN OWNER COMMAND.*"))
            return;
        }

        if(!isGroup){
            m.react("⛔")
            .then(() => reply("⛔ *THIS IS AN OWNER COMMAND.*"))
            return;
        }
            await reply("Goodbye! 👋");
            await new Promise(resolve => setTimeout(resolve, 1000));
            await conn.groupLeave(from);
            
    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});
