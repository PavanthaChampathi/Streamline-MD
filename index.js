const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    getContentType,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys');

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require('axios');
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

ownerNumbers = config.OWNER_NUMBER

let qrCodeData = ""; // To store the generated QR code

//=============================================

async function connectToWA() {
    try {
        //=============connect MongoDB==================
        const connectDB = require('./lib/mongodb');
        connectDB();
        //=============================================

        const { readEnv } = require('./lib/database');
        const config = await readEnv();
        const prefix = config.PREFIX;

        console.log("Connecting WA bot 🧬...");
        const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
        const { version } = await fetchLatestBaileysVersion();

        const conn = makeWASocket({
            logger: P({ level: 'silent' }),
            printQRInTerminal: false, // Disable QR print in terminal
            browser: ["Streamline-MD", "safari", "3.3"],
            syncFullHistory: true,
            auth: state,
            version
        });

        // Listen for QR code event and store it for display on the web
        conn.ev.on('connection.update', async (update) => {
            const { connection, qr, lastDisconnect } = update;

            if (qr) {
                qrCodeData = await qrcode.toDataURL(qr); // Convert QR code to base64
                console.log("QR code updated. Visit http://localhost:" + port + "/qr to scan.");
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
                console.log('Connection closed. Reason:', lastDisconnect?.error?.output?.payload?.message || 'Unknown reason');
                if (shouldReconnect) {
                    console.log('Reconnecting...');
                    connectToWA();
                } else {
                    console.log('Logged out from WhatsApp.');
                }
            } else if (connection === 'open') {
                console.log('😼 Installing... ');
                const path = require('path');
                fs.readdirSync("./commands/").forEach((plugin) => {
                    if (path.extname(plugin).toLowerCase() === ".js") {
                        require("./commands/" + plugin);
                    }
                });
                console.log('Plugins installed successfully ✅');
                console.log('Bot connected to WhatsApp ✅');

                const up = `🎉 Bot is up and running! 🎉`;

                const firstOwner = ownerNumbers[0] + "@s.whatsapp.net"; // Access the first owner number

                conn.sendMessage(firstOwner, {
                    image: { url: `https://telegra.ph/file/c130e7ab66afc462d0448.jpg` },
                    caption: up
                });

                // Clear QR code data after successful connection
                qrCodeData = "";
            }
        });

        // Save credentials whenever they're updated
        conn.ev.on('creds.update', saveCreds);

        // Handle incoming messages
        conn.ev.on('messages.upsert', async (mek) => {
            try {
                mek = mek.messages[0];
                if (!mek.message) return;

                mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

                if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true") {
                    await conn.readMessages([mek.key]);
                }

                const m = sms(conn, mek);
                const type = getContentType(mek.message);
                const body = (type === 'conversation') ? mek.message.conversation :
                    (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
                    (type === 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption :
                    (type === 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption : '';

                const from = mek.key.remoteJid;
                const isCmd = body.startsWith(prefix);
                const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
                const args = body.trim().split(/ +/).slice(1);
                const q = args.join(' ');
                const isGroup = from.endsWith('@g.us');
                const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net') : (mek.key.participant || mek.key.remoteJid);
                const senderNumber = sender.split('@')[0];
                const botNumber = conn.user.id.split(':')[0];
                const pushname = mek.pushName || 'Sin Nombre';
                const isMe = botNumber.includes(senderNumber);
                const isOwner = ownerNumbers.includes(senderNumber) || isMe;

                const botNumber2 = jidNormalizedUser(conn.user.id);
                const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => { }) : '';
                const groupAdmins = isGroup ? await getGroupAdmins(groupMetadata?.participants || []) : '';
                const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
                const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
                
                const reply = (teks) => {
                    conn.sendMessage(from, { text: teks }, { quoted: mek });
                };

                const events = require('./command');
                const cmdName = isCmd ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : false;

                if (isCmd) {
                    const cmd = events.commands.find((cmd) => cmd.pattern === cmdName) ||
                        events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));

                    if (cmd) {
                        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });

                        try {
                            cmd.function(conn, mek, m, { from, body, isCmd, command, args, q, isGroup, sender, senderNumber, isOwner, groupMetadata, isAdmins, reply });
                        } catch (e) {
                            console.error("[PLUGIN ERROR] " + e);
                        }
                    }
                }

                // Additional event handlers
                events.commands.map(async (command) => {
                    if (body && command.on === "body") {
                        command.function(conn, mek, m, { from, body, isCmd, command, args, q, isGroup, sender, senderNumber, isOwner, groupMetadata, isAdmins, reply });
                    }
                });
            } catch (err) {
                console.error('Error processing message:', err);
            }
        });
    } catch (err) {
        console.error("Error in connectToWA:", err);
    }
}

// Route to display QR code on the web
app.get("/qr", (req, res) => {
    if (qrCodeData) {
        res.send(`
            <html>
                <head>
                    <title>WhatsApp QR Code</title>
                </head>
                <body>
                    <h1>Scan the QR Code with WhatsApp</h1>
                    <img src="${qrCodeData}" alt="Scan the QR Code" />
                </body>
            </html>
        `);
    } else {
        res.send("QR Code is not available yet or the bot is already connected. Please refresh the page if you are expecting a QR code.");
    }
});

app.get("/", (req, res) => {
    res.send("Hey, bot started ✅. Go to <a href='/qr'>/qr</a> to scan the QR code.");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

// Start WhatsApp connection after a slight delay
setTimeout(() => {
    connectToWA();
}, 4000);
