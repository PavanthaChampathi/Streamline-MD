const config = require('../config');
const { cmd, commands } = require('../command');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { downloadMediaMessage } = require('../lib/msg');
const { filterKeywords } = require('../lib/keywordFilter');


//========================================== Gemini ===================================================

const messageStore = new Map(); // To store references to old messages

cmd({
    pattern: "gemini",
    alias: ["ai", "gpt"],
    desc: "Generate content using Gemini API.",
    category: "ai",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (filterKeywords(q)) {
            await m.react("🚫");
            return reply("🚫 Access Denied: Your request contains restricted keywords.");
        }

        if (m.type === 'imageMessage' || (m.quoted && m.quoted.type === 'imageMessage')) {

            await m.react("📸");
            m.reply(`📸 Processing image, please wait...\n🔄 Please hold on while we process the image.`);

            let media;
            if (m.type === 'imageMessage') {
                // Image sent in the current message
                media = await downloadMediaMessage(m, 'undefined');
            } else {
                // Image in a quoted message
                media = await m.quoted.download();
            }

            const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyCsVZ9YdsclFUdnJiixrIIfxy4B8FlZyto";
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

            try {
                // Prepare the image for the API
                const imagePart = {
                    inlineData: {
                        data: Buffer.from(media).toString("base64"),
                        mimeType: "image/png",
                    },
                };

                // Generate content
                const result = await model.generateContent([q, imagePart]);
                const response = result.response;
                const textResponse = await response.text();

                const responseMessage = 
`🌐 Streamline-MD 🌟
🔍 GEMINI API RESPONSE 📖

📝 Here’s what I generated: \n\n*${textResponse}*

${config.BOTTOM_FOOTER}`;

                reply(responseMessage);
            } catch (e) {
                await m.react("⚠️");
                console.error('Error processing image:', e);
                reply(`An error occurred while processing the image: ${e.message}`);
            }
        } else {
            // Handle text query or reply to an old message
            if (!q) {
                await m.react("❓");
                return reply("Please provide a prompt.");
            }

            // Check if the command is in reply to an old message
            const oldMessageId = m.quoted ? m.quoted.id : null;
            if (oldMessageId) {
                messageStore.set(oldMessageId, { prompt: q, timestamp: Date.now() });
            }
            
            await m.react("🧠");
            m.reply(`🔄 Generating content, please wait...\n📝 Please hold on while we create the content.`);

            const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyCsVZ9YdsclFUdnJiixrIIfxy4B8FlZyto"; 
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            
            try {
                const result = await model.generateContent([q]);
                const response = result.response;
                const textResponse = await response.text();

                const responseMessage = `
🌐 Streamline-MD 🌟
🔍 GEMINI API RESPONSE 📖

🔗 Prompt:  *_${q}_*

📝 Here’s what I generated: \n\n*${textResponse}*

${config.BOTTOM_FOOTER}
`;

                reply(responseMessage);
            } catch (e) {
                await m.react("⚠️");
                console.error('Error generating content:', e);
                reply(`An error occurred while generating content: ${e.message}`);
            }
        }
    } catch (e) {
        await m.react("⚠️");
        console.error('Error in Gemini command:', e);
        reply(`An unexpected error occurred: ${e.message}`);
    }
});


//=================================================================================================