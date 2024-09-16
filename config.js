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
    MONGODB: process.env.MONGODB,

    BOTTOM_FOOTER: "𝓢𝓣𝓡𝓔𝓐𝓜𝓛𝓘𝓝𝓔-𝓜𝓓",

    OWNER_NAME: process.env.OWNER_NAME,
    OWNER_NUMBER: process.env.OWNER_NUMBER,
    OWNER_EMAIL: process.env.OWNER_EMAIL,
    OWNER_COMPANY: process.env.OWNER_COMPANY,


};
