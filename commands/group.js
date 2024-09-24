const config = require('../config');
const os = require('os');
const fs = require('fs');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, jsonformat} = require('../lib/functions');

// Mute Group Command
cmd({
    pattern: "mute",
    desc: "Mutes the chat, allowing only admins to send messages",
    category: "group",
    use: '.mute',
    filename: __filename
}, async (conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) {
            m.react('🚫')  // React with 'no entry' emoji for non-group command
                .then(() => reply("❌ This command can only be used in a group chat."));
            return;
        }
        // Check if the bot is an admin
        if (!isBotAdmins) {
            m.react('⚠️')  // React with a warning emoji
                .then(() => reply("❌ I need admin privileges to execute this command. Please make me an admin!"));
            return;
        }
        // Check if the user is an admin or the owner
        if (!isAdmins && !isOwner) {
            m.react('🔒')  // React with 'lock' emoji
                .then(() => reply("❌ Only group admins can use this command."));
            return;
        }

        // Mute the group
        m.react("✅");
        await conn.groupSettingUpdate(mek.chat, 'announcement');
        await conn.sendMessage(from, { text: '🔇 *The group has been muted!* 🔇\n\n✨ Now Only group admins can send messages.' , quoted: mek });
    } catch (e) {
        reply(`Error: ${e.message}`);
        console.log(e);
    }
});


// Unmute Group Command
cmd({
    pattern: "unmute",
    desc: "Unmute the chat, allowing all members to send messagesp",
    category: "group",
    use: '.unmute',
    filename: __filename
}, async (conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) {
            m.react('🚫')  // React with 'no entry' emoji for non-group command
                .then(() => reply("❌ This command can only be used in a group chat."));
            return;
        }
        // Check if the bot is an admin
        if (!isBotAdmins) {
            m.react('⚠️')  // React with a warning emoji
                .then(() => reply("❌ I need admin privileges to execute this command. Please make me an admin!"));
            return;
        }
        // Check if the user is an admin or the owner
        if (!isAdmins && !isOwner) {
            m.react('🔒')  // React with 'lock' emoji
                .then(() => reply("❌ Only group admins can use this command."));
            return;
        }

        // Mute the group
        m.react("✅");
        await conn.groupSettingUpdate(mek.chat, 'not_announcement');
        await conn.sendMessage(from, { text: '🔊 *The group has been Unmuted!* 🔊\n\n✨ Now all members can send messages.' , quoted: mek });
    } catch (e) {
        reply(`Error: ${e.message}`);
        console.log(e);
    }
});

// Promote Member to Admin Command
cmd({
    pattern: "promote",
    react: "🔖",
    desc: "Promote a member to admin",
    category: "group",
    use: '.promote',
    filename: __filename
}, async (conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply(ONLGROUP);
        if (!isBotAdmins) return reply(botAdmin);
        if (!isAdmins) return reply(ADMIN);

        let users = mek.mentionedJid ? mek.mentionedJid : mek.quoted ? mek.quoted.sender : q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await conn.groupParticipantsUpdate(mek.chat, [users], 'promote')
            .then(res => reply(jsonformat(res)))
            .catch(err => reply(jsonformat(err)));
        reply('🛑 *NEW ADMIN PROMOTED*');
        await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }});
    } catch (e) {
        reply('*Done ✓✓*');
        l(e);
    }
});

// Demote Admin to Member Command
cmd({
    pattern: "demote",
    react: "🔖",
    desc: "Demote an admin to a member",
    category: "group",
    use: '.demote',
    filename: __filename
}, async (conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply(ONLGROUP);
        if (!isBotAdmins) return reply(botAdmin);
        if (!isAdmins) return reply(ADMIN);

        let users = mek.mentionedJid ? mek.mentionedJid : mek.quoted ? mek.quoted.sender : q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await conn.groupParticipantsUpdate(mek.chat, [users], 'demote')
            .then(res => reply(jsonformat(res)))
            .catch(err => reply(jsonformat(err)));
        reply('*🛑 ADMIN DEMOTED BY OWNER❌*');
        await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }});
    } catch (e) {
        reply('*Done ✓✓*');
        l(e);
    }
});

// Delete Message Command
cmd({
    pattern: "del",
    react: "❌",
    alias: [","],
    desc: "Delete message",
    category: "group",
    use: '.del',
    filename: __filename
}, async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner || !isAdmins) return;
    try {
        if (!m.quoted) return reply(mg.notextfordel);
        const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        };
        await conn.sendMessage(m.chat, { delete: key });
    } catch (e) {
        console.log(e);
        reply('Error!!');
    }
});

// Add Member Command
cmd({
    pattern: "add",
    desc: "Add a member to the group",
    category: "group",
    react: "➕",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
        if (!isAdmins) return reply('You must be an admin to use this command.');

        const user = q.split(' ')[0];
        if (!user) return reply('Please provide a phone number to add.');

        await conn.groupParticipantsUpdate(from, [`${user}@s.whatsapp.net`], 'add');
        await reply(`@${user} has been added to the group.`, { mentions: [`${user}@s.whatsapp.net`] });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// Set Goodbye Message Command
cmd({
    pattern: "setgoodbye",
    desc: "Set the goodbye message for the group",
    category: "group",
    react: "👋",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
        if (!isAdmins) return reply('You must be an admin to use this command.');

        const goodbye = q;
        if (!goodbye) return reply('Please provide a goodbye message.');

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: goodbye });
        await reply('Goodbye message has been set.');
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// Set Welcome Message Command
cmd({
    pattern: "setwelcome",
    desc: "Set the welcome message for the group",
    category: "group",
    react: "👋",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
        if (!isAdmins) return reply('You must be an admin to use this command.');

        const welcome = q;
        if (!welcome) return reply('Please provide a welcome message.');

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: welcome });
        await reply('Welcome message has been set.');
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});



