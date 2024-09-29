const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, 'config.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

// Export configuration settings
module.exports = {

    SESSION_ID: process.env.SESSION_ID,

    BOTTOM_FOOTER: "​> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴛʀᴇᴀᴍʟɪɴᴇ-ᴍᴅ​",
    PREFIX: process.env.PREFIX || ".",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
    MOOD: process.env.MOOD || "public",

    ALIVE_MSG: process.env.ALIVE_MSG || "👋 Hello I'm,\n🌐 Streamline-MD 🌟\n✨ I'm alive now! ✨\n\n📜To get the commands📜 send .menu",

    OWNER_NAME: process.env.OWNER_NAME || "Pavantha Champathi",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "94713829670",
    OWNER_EMAIL: process.env.OWNER_EMAIL || "pavanthachampathi@gmail.com",
    OWNER_COMPANY: process.env.OWNER_COMPANY || "Future Innovations LK", 

    CO_OWNER_NUMBERS: process.env.CO_OWNER_NUMBERS ? process.env.CO_OWNER_NUMBERS.split(',') : ['94729039766'],
};

