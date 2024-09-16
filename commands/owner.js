const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    desc: "Get the bot's owner number",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    try {
        // Extract the owner's number from the config
        const OWNER_NUMBER = config.OWNER_NUMBER;
        const OWNER_NAME = config.OWNER_NAME;
        const OWNER_EMAIL = config.OWNER_EMAIL;
        const OWNER_COMPANY = config.OWNER_COMPANY;;

        let vcard = 
`BEGIN:VCARD
VERSION:3.0
N:${OWNER_NAME}
FN:${OWNER_NAME}
ORG:${OWNER_COMPANY}
EMAIL:${OWNER_EMAIL}
item1.TEL;type=CELL;type=VOICE;waid=${OWNER_NUMBER}:${OWNER_NUMBER}
item1.X-ABLabel:Click here to chat
END:VCARD`;
	
		// Send the contact card
		conn.sendMessage(m.chat, { contacts: { displayName: OWNER_NAME, contacts: [{ vcard }] } }, { quoted: m });
        


    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
});
