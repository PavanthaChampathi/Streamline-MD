const fs = require('fs');
const path = require('path');
const { readEnv } = require('../lib/database');
const { cmd, commands } = require('../command');

const IMG_PATH = path.join(__dirname, '../images');
const menuMessageIds = new Map();

// Format the commands for each section
const formatCommands = (commandList) => 
    commandList.split('\n').filter(cmd => cmd).map(cmd => `║------- ${cmd}`).join('\n');

// Menu command handler
cmd({
    pattern: "menu",
    desc: "Get cmd list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const config = await readEnv();
        const menu = commands.reduce((acc, cmd) => {
            if (cmd.pattern && !cmd.dontAddCommandList) {
                acc[cmd.category] = (acc[cmd.category] || '') + `${config.PREFIX}${cmd.pattern}\n`;
            }
            return acc;
        }, {});

        const madeMenu = 
`╔═〘 ᴡᴇʟᴄᴏᴍᴇ, ${pushname} 〙═╗
║  
╠═〘 ᴄᴏᴍᴍᴀɴᴅꜱ 〙═
║  
║  1  OWNER
║  2  CONVERT
║  3  AI
║  4  SEARCH
║  5  DOWNLOAD
║  6  MATHTOOL
║  7  MAIN
║  8  GROUP
║  9  STICKER
║ 10 GAME
╚═━─────●●►

🌟 *Reply with the Number you want to select*`;

        m.react("📜");
        const menuMessage = await conn.sendMessage(from, {
            image: { url: path.join(IMG_PATH, 'BOTLOGOL_IMG.png') },
            caption: madeMenu
        }, { quoted: mek });

        menuMessageIds.set(from, menuMessage.key.id);

    } catch (e) {
        console.error(e);
        reply && reply(`Error: ${e.message}`);
    }
});

// Menu reply handler
cmd({
    on: "body"
}, async (conn, mek, m, { from, body, reply }) => {
    try {
        const config = await readEnv();
        const menu = commands.reduce((acc, cmd) => {
            if (cmd.pattern && !cmd.dontAddCommandList) {
                acc[cmd.category] = (acc[cmd.category] || '') + `${config.PREFIX}${cmd.pattern}\n`;
            }
            return acc;
        }, {});

        const menuMessageId = menuMessageIds.get(from);
        if (!m.quoted || m.quoted.id !== menuMessageId) return;

        const selectedOption = parseInt(body);
        if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > 10) {
            return reply("Please enter a valid number between 1 and 10.");
        }

        const menuContent = {
            1: `╔═〘 OWNER 〙═╗\n║\n${formatCommands(menu.owner)}\n║\n╚═━─────●●►`,
            2: `this is not configured yet`,
            3: `╔═〘 AI 〙═╗\n║\n${formatCommands(menu.ai)}\n║\n╚═━─────●●►`,
            4: `╔═〘 SEARCH 〙═╗\n║\n${formatCommands(menu.search)}\n║\n╚═━─────●●►`,
            5: `╔═〘 DOWNLOAD 〙═╗\n║\n${formatCommands(menu.downlode)}\n║\n╚═━─────●●►`,
            6: `╔═〘 MAIN 〙═╗\n║\n${formatCommands(menu.main)}\n║\n╚═━─────●●►`,
            7: `╔═〘 GROUP 〙═╗\n║\n${formatCommands(menu.group)}\n║\n╚═━─────●●►`,
            8: `this is not configured yet`,
            9: `this is not configured yet`,
            10: `this is not configured yet`
        };

        await conn.sendMessage(from, { text: menuContent[selectedOption] }, { quoted: m });
    } catch (e) {
        console.error(e);
        reply && reply(`Error: ${e.message}`);
    }
});
