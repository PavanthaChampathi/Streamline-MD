const mongoose = require('mongoose');
const config = require('../config');
const EnvVar = require('./mongodbenv');

const defaultEnvVariables = [
    { key: 'ALIVE_IMG', value: 'https://telegra.ph/file/3454b138d24b33d7ce893.jpg' },
    { key: 'MENU_IMG', value: 'https://telegra.ph/file/692a0fb33f4b55e980e75.jpg' },
    { key: 'ALIVE_MSG', value: 
`👋 Hello I'm,
🌐 Streamline-MD 🌟     
✨ I'm alive now! ✨

📜To get the commands📜 send .menu`, },

    { key: 'PREFIX', value: '.' },
    { key: 'AUTO_READ_STATUS', value: '' },
    { key: 'MODE', value: 'public' },
    { key: 'AUTO_VOICE', value: 'true' },
    { key: 'AUTO_STICKER', value: 'true' },
    { key: 'AUTO_REPLY', value: 'true' },
];

// MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB);
        console.log('🛜 MongoDB Connected ✅');

        // Check and create default environment variables
        for (const envVar of defaultEnvVariables) {
            const existingVar = await EnvVar.findOne({ key: envVar.key });

            if (!existingVar) {
                // Create new environment variable with default value
                await EnvVar.create(envVar);
                console.log(`➕ Created default env var: ${envVar.key}`);
            }
        }

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;