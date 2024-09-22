const config = ('../config')
const {cmd, commands} = require('../command');
const path = require('path');

const IMG_PATH = path.join(__dirname, '../images');

cmd({
    pattern: "list",
    desc: "Get all comands",
    category: "main",
    filename: __filename
},
async(conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        let menu = {
            main: '',
            download: '',
            group: '',
            owner: '',
            convert: '',
            search: '',
            ai: ''
        };

        for (let i = 0; i < commands.length; i++) {
            if (commands[i].pattern && !commands[i].dontAddCommandList) {
                menu[commands[i].category] += `${config.PREFIX}${commands[i].pattern}\n`;
            }
        }

        // Format the commands for each section
        const formatCommands = (commandList) => {
            return commandList.split('\n').filter(cmd => cmd).map(cmd => `║------- ${cmd}`).join('\n');
        };

        // Regular menu
        let madeMenu = 
`╔═〘 ᴡᴇʟᴄᴏᴍᴇ, ${pushname} 〙═╗
║  
║  
╠═〘 ᴄᴏᴍᴍᴀɴᴅꜱ 〙═
║  
║===== OWNER
${formatCommands(menu.owner)}
║
║===== CONVERT
║
║===== AI
${formatCommands(menu.ai)}
║
║===== SEARCH
${formatCommands(menu.search)}
║
║===== DOWNLOAD
${formatCommands(menu.download)}
║
║===== MATHTOOL
║
║===== MAIN
${formatCommands(menu.main)}
║
║===== GROUP
${formatCommands(menu.group)}
║
║===== STICKER
║
║===== GAME
║  
╚═━─────●●►

✨ *Send any command you want to use* ✨`;

m.react("📜");
await conn.sendMessage(from, { 
    image: { url: path.join(IMG_PATH, 'BOTLOGOL_IMG.png') }, 
    caption: madeMenu
}, { quoted: mek });

return
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
