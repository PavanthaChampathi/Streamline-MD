const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms, downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')

const ownerNumbers = ['94713829670'];

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
  //=============connect MongoDB==================
  const connectDB = require('./lib/mongodb')
  connectDB();
  //=============================================

  const { readEnv } = require('./lib/database')
  const config = await readEnv();
  const prefix = config.PREFIX

  console.log("Connecting wa bot 🧬...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/')
  var { version } = await fetchLatestBaileysVersion()

  const conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: ["Streamline-MD", "safari", "3.3"],
      syncFullHistory: true,
      auth: state,
      version
  })

  // Listen for QR code event and print it in the terminal
  conn.ev.on('connection.update', (update) => {
      const { connection, qr, lastDisconnect } = update

      // If no session exists, show QR code in terminal
      if (qr) {
          qrcode.generate(qr, { small: true }) // Generates and displays QR code in terminal
          console.log("Scan the QR code above to log in.")
      }

      if (connection === 'close') {
          if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
              console.log('Connection closed, reconnecting...')
              connectToWA()
          } else {
              console.log('Logged out from WhatsApp')
          }
      } else if (connection === 'open') {
          console.log('😼 Installing... ')
          const path = require('path');
          fs.readdirSync("./commands/").forEach((plugin) => {
              if (path.extname(plugin).toLowerCase() == ".js") {
                  require("./commands/" + plugin);
              }
          });
          console.log('Plugins installed successfully ✅')
          console.log('Bot connected to WhatsApp ✅')

          let up = `🎉 Bot is up and running! 🎉`;

          const firstOwner = ownerNumbers[0] + "@s.whatsapp.net"; // Access the first number

          conn.sendMessage(firstOwner, {
              image: { url: `https://telegra.ph/file/c130e7ab66afc462d0448.jpg` },
              caption: up
          });
      }
  })

  // Save credentials whenever they're updated
  conn.ev.on('creds.update', saveCreds)

  // Handle incoming messages
  conn.ev.on('messages.upsert', async (mek) => {
      mek = mek.messages[0]
      if (!mek.message) return
      mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
      if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true") {
          await conn.readMessages([mek.key])
      }
      const m = sms(conn, mek)
      const type = getContentType(mek.message)
      const content = JSON.stringify(mek.message)
      const from = mek.key.remoteJid
      const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
      const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
      const isCmd = body.startsWith(prefix)
      const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
      const args = body.trim().split(/ +/).slice(1)
      const q = args.join(' ')
      const isGroup = from.endsWith('@g.us')
      const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
      const senderNumber = sender.split('@')[0]
      const botNumber = conn.user.id.split(':')[0]
      const pushname = mek.pushName || 'Sin Nombre'
      const isMe = botNumber.includes(senderNumber)
      const isOwner = ownerNumbers.includes(senderNumber) || isMe
      const botNumber2 = await jidNormalizedUser(conn.user.id);
      const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => { }) : ''
      const groupName = isGroup ? groupMetadata.subject : ''
      const participants = isGroup ? await groupMetadata.participants : ''
      const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
      const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
      const isAdmins = isGroup ? groupAdmins.includes(sender) : false
      const reply = (teks) => {
          conn.sendMessage(from, { text: teks }, { quoted: mek })
      }

      // Handle command execution
      const events = require('./command')
      const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
      if (isCmd) {
          const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
          if (cmd) {
              if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })

              try {
                  cmd.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
              } catch (e) {
                  console.error("[PLUGIN ERROR] " + e);
              }
          }
      }

      events.commands.map(async (command) => {
          if (body && command.on === "body") {
              command.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
          }
      });

  })
}

app.get("/", (req, res) => {
  res.send("hey, bot started✅");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(() => {
  connectToWA()
}, 4000);
