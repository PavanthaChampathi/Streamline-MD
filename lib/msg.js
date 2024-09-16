const { proto, downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys');
const fs = require('fs');

const downloadMediaMessage = async(m, filename) => {
    try {
        if (m.type === 'viewOnceMessage') {
            m.type = m.msg.type;
        }

        const typeMap = {
            'imageMessage': { extension: 'jpg', mimeType: 'image' },
            'videoMessage': { extension: 'mp4', mimeType: 'video' },
            'audioMessage': { extension: 'mp3', mimeType: 'audio' },
            'stickerMessage': { extension: 'webp', mimeType: 'sticker' },
            'documentMessage': { extension: m.msg.fileName.split('.').pop().toLowerCase().replace('jpeg', 'jpg').replace('png', 'jpg').replace('m4a', 'mp3'), mimeType: 'document' }
        };

        const mediaInfo = typeMap[m.type];
        if (!mediaInfo) {
            throw new Error('Unsupported media type');
        }

        const { extension, mimeType } = mediaInfo;
        const stream = await downloadContentFromMessage(m.msg, mimeType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        const filenameWithExt = filename ? `${filename}.${extension}` : `undefined.${extension}`;
        fs.writeFileSync(filenameWithExt, buffer);
        return fs.readFileSync(filenameWithExt);
    } catch (error) {
        console.error('Error downloading media message:', error);
        throw error;
    }
};

const sms = (conn, m) => {
    if (m.key) {
        m.id = m.key.id;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = m.fromMe ? conn.user.id.split(':')[0]+'@s.whatsapp.net' : m.isGroup ? m.key.participant : m.key.remoteJid;
    }
    if (m.message) {
        m.type = getContentType(m.message);
        m.msg = (m.type === 'viewOnceMessage') ? m.message[m.type].message[getContentType(m.message[m.type].message)] : m.message[m.type];
        if (m.msg) {
            if (m.type === 'viewOnceMessage') {
                m.msg.type = getContentType(m.message[m.type].message);
            }
            const quotedMention = m.msg.contextInfo?.participant || '';
            const tagMention = m.msg.contextInfo?.mentionedJid || [];
            const mention = typeof(tagMention) === 'string' ? [tagMention] : tagMention;
            mention.push(quotedMention);
            m.mentionUser = mention.filter(x => x);
            m.body = (m.type === 'conversation') ? m.msg : (m.type === 'extendedTextMessage') ? m.msg.text : (m.type === 'imageMessage' && m.msg.caption) ? m.msg.caption : (m.type === 'videoMessage' && m.msg.caption) ? m.msg.caption : (m.type === 'templateButtonReplyMessage' && m.msg.selectedId) ? m.msg.selectedId : (m.type === 'buttonsResponseMessage' && m.msg.selectedButtonId) ? m.msg.selectedButtonId : '';
            m.quoted = m.msg.contextInfo?.quotedMessage || null;
            if (m.quoted) {
                m.quoted.type = getContentType(m.quoted);
                m.quoted.id = m.msg.contextInfo.stanzaId;
                m.quoted.sender = m.msg.contextInfo.participant;
                m.quoted.fromMe = m.quoted.sender.split('@')[0].includes(conn.user.id.split(':')[0]);
                m.quoted.msg = (m.quoted.type === 'viewOnceMessage') ? m.quoted[m.quoted.type].message[getContentType(m.quoted[m.quoted.type].message)] : m.quoted[m.quoted.type];
                if (m.quoted.type === 'viewOnceMessage') {
                    m.quoted.msg.type = getContentType(m.quoted[m.quoted.type].message);
                }
                const quoted_quotedMention = m.quoted.msg.contextInfo?.participant || '';
                const quoted_tagMention = m.quoted.msg.contextInfo?.mentionedJid || [];
                const quoted_mention = typeof(quoted_tagMention) === 'string' ? [quoted_tagMention] : quoted_tagMention;
                quoted_mention.push(quoted_quotedMention);
                m.quoted.mentionUser = quoted_mention.filter(x => x);
                m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
                    key: {
                        remoteJid: m.chat,
                        fromMe: m.quoted.fromMe,
                        id: m.quoted.id,
                        participant: m.quoted.sender
                    },
                    message: m.quoted
                });
                m.quoted.download = (filename) => downloadMediaMessage(m.quoted, filename);
                m.quoted.delete = () => conn.sendMessage(m.chat, { delete: m.quoted.fakeObj.key });
                m.quoted.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.quoted.fakeObj.key } });
            }
        }
        m.download = (filename) => downloadMediaMessage(m, filename);
    }
    
    m.reply = (text, id = m.chat, option = { mentions: [m.sender] }) => conn.sendMessage(id, { text, contextInfo: { mentionedJid: option.mentions } }, { quoted: m });
    m.replyS = (sticker, id = m.chat, option = { mentions: [m.sender] }) => conn.sendMessage(id, { sticker, contextInfo: { mentionedJid: option.mentions } }, { quoted: m });
    m.replyImg = (img, text, id = m.chat, option = { mentions: [m.sender] }) => conn.sendMessage(id, { image: img, caption: text, contextInfo: { mentionedJid: option.mentions } }, { quoted: m });
    m.replyVid = (vid, text, id = m.chat, option = { mentions: [m.sender], gif: false }) => conn.sendMessage(id, { video: vid, caption: text, gifPlayback: option.gif, contextInfo: { mentionedJid: option.mentions } }, { quoted: m });
    m.replyAud = (aud, id = m.chat, option = { mentions: [m.sender], ptt: false }) => conn.sendMessage(id, { audio: aud, ptt: option.ptt, mimetype: 'audio/mpeg', contextInfo: { mentionedJid: option.mentions } }, { quoted: m });
    m.replyDoc = (doc, id = m.chat, option = { mentions: [m.sender], filename: 'undefined.pdf', mimetype: 'application/pdf' }) => conn.sendMessage(id, { document: doc, mimetype: option.mimetype, fileName: option.filename, contextInfo: { mentionedJid: option.mentions } }, { quoted: m });
    m.replyContact = (name, number, info) => {
        let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nORG:${info}\nitem1.TEL;type=CELL;type=VOICE;waid=${number}:${number}\nitem1.X-ABLabel:Click here to chat\nEND:VCARD`;
        conn.sendMessage(m.chat, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: m });
    };
    m.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
    
    return m;
};

module.exports = { sms, downloadMediaMessage };
