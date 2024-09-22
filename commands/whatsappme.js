const {cmd , commands} = require('../command')

cmd({
    pattern: "wa",
    alias: ["whatsappme", "me"],
    desc: "Get your WhatsApp me link.",
    category: "useful",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try {
    if (!senderNumber) {
        m.react("😓")
        .then(() => reply('😓Unable to retrieve your phone number😓'));
        return;
    }

    if (!q) {
        m.react("🔗")
        .then(() => reply(`📱 Here’s your WhatsApp link:\nhttps://wa.me/${senderNumber}`));
        return;
    }

    
    const encodedMessage = encodeURIComponent(q);
    const waMeLink = `https://wa.me/${senderNumber}?text=${encodedMessage}`;

    m.react("🔗")
    .then(() => reply(`📱 Here’s your WhatsApp link:\n${waMeLink}`));

} catch (e) {
    console.log(e);
    reply(`An error occurred: ${e.message}`);
}
});
