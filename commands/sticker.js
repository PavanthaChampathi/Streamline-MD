const sharp = require('sharp');
const fs = require('fs');
const { Sticker } = require('wa-sticker-formatter');
const path = require('path');
const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('../lib/msg');

cmd({
    pattern: 'sticker',
    desc: 'Convert image to WhatsApp sticker.',
    alias: ["s", "st"],
    category: 'media',
    filename: __filename
},
async (conn, mek, m, { quoted, isMedia, isImage, reply }) => {
    try {
        let media;
        if (m.type === 'imageMessage') {
            media = await downloadMediaMessage(m, 'buffer');
        } else if (m.quoted && m.quoted.type === 'imageMessage') {
            media = await m.quoted.download();
        } else {
            return reply('❌ Please reply to an image to convert it to a sticker.');
        }

        const outputPath = path.join(__dirname, 'output.webp');

        // Convert the image using sharp
        await sharp(media)
            .webp({ quality: 90 })
            .toFile(outputPath);

        // Create a sticker using wa-sticker-formatter
        const sticker = new Sticker(outputPath, {
            pack: 'Streamline-MD',
            author: 'Pavantha Champathi',
            type: 'FULL', // Use 'FULL' directly
            quality: 90,
        });

        // Send the sticker
        await conn.sendMessage(m.chat, await sticker.toMessage(), { quoted: mek });

        // Clean up the file
        fs.unlinkSync(outputPath);
    } catch (err) {
        console.error(err);
        reply(`⚠️ Error: ${err.message}`);
    }
});
