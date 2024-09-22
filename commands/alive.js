const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd, commands } = require('../command');

// Path to images directory
const IMG_PATH = path.join(__dirname, '../images');

cmd({
    pattern: "alive",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    m.react("✨")
    conn.sendMessage(from, image: { url: path.join(IMG_PATH, 'ALIVE_IMG.jpg') },, { quoted: mek });
}catch(e){
console.log(e)
reply(`${e}`)
}
})
