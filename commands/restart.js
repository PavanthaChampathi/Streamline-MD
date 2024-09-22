const config = require('../config');
const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "restart",
    desc: "restart the bot",
    alias: ["res", "rest"],
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) {
            m.react("🚫")
            .then(() => reply("🚫 Access Denied: This command is restricted to the bot owner only. 🔒"))
        return;
        }
        const { exec } = require("child_process");

        let restart = `
🌐 BOT IS RESTARTING... 
🚀 Please wait a moment...
`
        m.react("🔄")
        .then(() => reply(restart));
        await sleep(1500);
        exec("pm2 restart all", (error, stdout, stderr) => {
            if (error) {
                console.log(`Error: ${error.message}`);
                return reply(`Error: ${error.message}`);
            }
            if (stderr) {
                console.log(`Stderr: ${stderr}`);
                return reply(`Stderr: ${stderr}`);
            }
            console.log(`Stdout: ${stdout}`);
            reply("Bot has been restarted.");
        });
    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e}`);
    }
});
