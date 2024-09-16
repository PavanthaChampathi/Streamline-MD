const { updateEnv, readEnv } = require('../lib/database');
const EnvVar = require('../lib/mongodbenv');
const { cmd } = require('../command');

cmd({
    pattern: "update",
    alias: ["updateenv"],
    desc: "Check and update environment variables",
    category: "owner",
    filename: __filename,
},
async (conn, mek, m, { from, q, reply, isOwner }) => {
    if (!isOwner){
        m.react("🚫")
        .then(() => reply("🚫 Access Denied: This command is restricted to the bot owner only. 🔒"))
        return;
    } 

    if (!q) {
        m.react("🙇‍♂️")
        .then(() => reply("🙇‍♂️ *Please provide the environment variable and its new value.* \n\n📝 Example: `.update ALIVE_MSG: hello i am alive`"))
        return;
    }

    // Find the position of the first colon or comma
    const colonIndex = q.indexOf(':');
    const commaIndex = q.indexOf(',');

    // Ensure we have a valid delimiter index
    const delimiterIndex = colonIndex !== -1 ? colonIndex : commaIndex;
    if (delimiterIndex === -1) {
        m.react("🫠")
        .then(() => reply("🫠 *Invalid format. Please use the format:*\n`.update KEY:VALUE`"))
        return;
    }

    // Extract key and value
    const key = q.substring(0, delimiterIndex).trim();
    const value = q.substring(delimiterIndex + 1).trim();
    
    // Extract mode if provided
    const parts = value.split(/\s+/).filter(part => part.trim());
    const newValue = value; // Use the full value as provided by the user
    const mode = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
    
    const validModes = ['public', 'private', 'groups', 'inbox'];
    const finalMode = validModes.includes(mode) ? mode : '';

    if (!key || !newValue) {
        m.react("🫠")
        .then(() => reply("🫠 *Invalid format. Please use the format:*\n`.update KEY:VALUE`"))
        return;
    }

    // Specific checks for MODE, ALIVE_IMG, and AUTO_READ_STATUS
    if (key === 'MODE' && !validModes.includes(newValue)) {
        m.react("😒")
        .then(() => reply(`😒 *Invalid mode. Valid modes are: ${validModes.join(', ')}*`))
        return;
    }

    if (key === 'ALIVE_IMG' && !newValue.startsWith('https://')) {
        m.react("😓")
        .then(() => reply("😓 *Invalid URL format. PLEASE GIVE ME IMAGE URL*"))
        return;
    }

    if (key === 'MENU_IMG' && !newValue.startsWith('https://')) {
        m.react("😓")
        .then(() => reply("😓 *Invalid URL format. PLEASE GIVE ME IMAGE URL*"))
        return;
    }

    if (key === 'AUTO_READ_STATUS' && !['true', 'false'].includes(newValue)) {
        m.react("😓")
        .then(() => reply("😓 *Invalid value for AUTO_READ_STATUS. Please use `true` or `false`.*"))
        return;
    }

    if (key === 'AUTO_VOICE' && !['true', 'false'].includes(newValue)) {
        m.react("😓")
        .then(() => reply("😓 *Invalid value for AUTO_READ_STATUS. Please use `true` or `false`.*"))
        return;
    }

    if (key === 'AUTO_STICKER' && !['true', 'false'].includes(newValue)) {
        m.react("😓")
        .then(() => reply("😓 *Invalid value for AUTO_READ_STATUS. Please use `true` or `false`.*"))
        return;
    }

    if (key === 'AUTO_REPLY' && !['true', 'false'].includes(newValue)) {
        m.react("😓")
        .then(() => reply("😓 *Invalid value for AUTO_READ_STATUS. Please use `true` or `false`.*"))
        return;
    }

    if (key === 'SPAM' && !['true', 'false'].includes(newValue)) {
        m.react("😓")
        .then(() => reply("😓 *Invalid value for AUTO_READ_STATUS. Please use `true` or `false`.*"))
        return;
    }

    
    try {
        // Check if the environment variable exists
        const envVar = await EnvVar.findOne({ key: key });

        if (!envVar) {
            // If the variable does not exist, fetch and list all existing env vars
            const allEnvVars = await EnvVar.find({});
            const envList = allEnvVars.map(env => `${env.key}: ${env.value}`).join('\n');

            m.react("❌")
            .then(() => reply(`❌ *The environment variable ${key} does not exist.*\n\n*Here are the existing environment variables:*\n\n${envList}`))
            return;
            
        }

        // Update the environment variable
        await updateEnv(key, newValue, finalMode);
        m.react("✅")
        .then(() => reply(`✅ *Environment variable updated.*\n\n🗃️ *${key}* ➠ ${newValue} ${finalMode ? `\n*Mode:* ${finalMode}` : ''}`));
        
    } catch (err) {
        console.error('Error updating environment variable:' + err.message);
        m.react("⚠")
        .then(() => reply("🙇‍♂️ *Failed to update the environment variable. Please try again.*" + err));
    }
});