const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd, commands } = require('../command');

// Path to images directory
const IMG_PATH = path.join(__dirname, '../images');

cmd({

    pattern: "support",
    desc: "To get the bot informations.",
    react: "⛓",
    category: "main",
    filename: __filename

},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let about = ` *👋 ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ɢʀᴏᴜᴘ ${pushname}*
https://www.whatsapp.com/channel/0029VakuQBECBtxLpMSdrG1A`

//return await conn.sendMessage(from,{image: {url:`YOUR URL`},caption:about},{quoted: mek})

            await conn.sendMessage(from, {
            image: { url: path.join(IMG_PATH, 'BOTLOGOL_IMG.png') },
            caption: about
        }, { quoted: mek });

}catch(e){
console.log(e)
reply(`${e}`)
}
})
