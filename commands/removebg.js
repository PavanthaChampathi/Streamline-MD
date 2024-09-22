const removeBg = require('remove.bg');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('../lib/msg');

cmd({
    pattern: "removebg",
    desc: "Remove Background Using remove.bg",
    alias: ["rebg", "rmbg"],
    category: "converters",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (m.type === 'imageMessage' || (m.quoted && m.quoted.type === 'imageMessage')) {
            await m.react("📸");
            m.reply(`📸 Processing image, please wait...`);
    
            let media;
            if (m.type === 'imageMessage') {
                // Image sent in the current message
                media = await downloadMediaMessage(m, 'buffer'); // Use buffer to ensure proper format
            } else {
                // Image in a quoted message
                media = await m.quoted.download();
            }

            const apiKey = 'brYfdRzmMHd2WkhuP1FuQr1P'; // Replace with your actual API key
    
            // Save the media to a file
            const inputPath = path.join(__dirname, 'temp.jpg');
            const outputPath = path.join(__dirname, 'output.png');
            fs.writeFileSync(inputPath, media); // Ensure media is a buffer
    
            // Process the image
            removeBg.removeBackgroundFromImageFile({
                path: inputPath,
                apiKey: apiKey,
                size: 'auto'
            }).then((result) => {
                fs.writeFileSync(outputPath, result.base64img, 'base64'); // Save result as base64 image
                conn.sendMessage(from, { image: fs.readFileSync(outputPath), caption: 'Here is the image with the background removed.' }, { quoted: mek });
                fs.unlinkSync(inputPath); // Clean up temporary file
                fs.unlinkSync(outputPath); // Clean up output file
            }).catch((error) => {
                console.error('Error:', error);
                reply("An error occurred while processing the image.");
            });
        } else {
            await m.react("🚫");
            return reply("❗🚫 Please send an image or reply to an image. 🚫❗");
        }
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
