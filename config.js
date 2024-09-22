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

    SESSION_ID: process.env.SESSION_ID || "azAT2aya#p263sVeklUpNUSfOJmkWlRgAyLIBlHDNzBAyePN6TxA",

    MONGODB: process.env.MONGODB || "//mongo:thVCdVUqJrvFHcejdnDFcpLEDaVaedsd@junction.proxy.rlwy.net:26885",

    BOTTOM_FOOTER: "𝓢𝓣𝓡𝓔𝓐𝓜𝓛𝓘𝓝𝓔-𝓜𝓓",
    PREFIX:".",
    AUTO_READ_STATUS:"true",

    OWNER_NAME: process.env.OWNER_NAME || "Pavantha Champathi",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "94713829670",
    OWNER_EMAIL: process.env.OWNER_EMAIL || "pavanthachampathi@gmail.com",
    OWNER_COMPANY: process.env.OWNER_COMPANY || "Future Innovations LK", 


};
