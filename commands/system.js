const config = require('../config')
const { cmd, commands } = require('../command')
const os = require("os")
const { runtime } = require('../lib/functions')
const path = require('path');

// Path to your image folder
const IMG_PATH = path.join(__dirname, '../images');

cmd({
    pattern: "system",
    alias: ["status", "botinfo","info","infobot","uptime"],
    desc: "Check uptime, RAM usage, CPU info, network interfaces, and more",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        
        let cpuInfo = os.cpus()[0];
        let status = 
`🛠️ Streamline-MD SYSTEM INFORMATION:

🌟 *Uptime:* ${runtime(process.uptime())}
💾 *RAM Usage:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem() / 1024 / 1024)} MB
🏠 *Hostname:* ${os.hostname()}
📊 *CPU Info:* ${cpuInfo.model} (${cpuInfo.speed} MHz)
🖥️ *Platform:* ${os.platform()} ${os.release()}

✨ᴅᴇᴠᴏʟᴏᴘᴇʀꜱ- ᴘᴀᴠᴀɴᴛʜᴀ ᴄʜᴀᴍᴘᴀᴛʜɪ & ᴅᴀʀᴋ-x-ᴋɪɴɢ ✨
`;     
        m.react("🧬");
        await conn.sendMessage(from, { 
            image: { url: path.join(IMG_PATH, 'BOTLOGOL_IMG.png') }, 
            caption: status 
        }, { quoted: mek });
        
        return
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
});
