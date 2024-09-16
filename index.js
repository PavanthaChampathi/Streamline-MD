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

const ownerNumbers = ['94713829670'];

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

let qrCodeDataURL = null;  // To store the QR code data URL

//=============================================

async function connectToWA() {
  //=============connect MongoDB==================
  const connectDB = require('./lib/mongodb');
  connectDB();
  //=============================================

  const { readEnv } = require('./lib/database');
  const config = await readEnv();
  const prefix = config.PREFIX;

  console.log("Connecting wa bot 🧬...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
  var { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,  // Disable terminal QR code
      browser: ["Streamline-MD", "safari", "3.3"],
      syncFullHistory: true,
      auth: state,
      version
  });

  // Listen for QR code event and generate it as a data URL
  conn.ev.on('connection.update', async (update) => {
      const { connection, qr, lastDisconnect } = update;

      // If no session exists, generate QR code as a data URL
      if (qr) {
          qrCodeDataURL = await qrcode.toDataURL(qr);  // Generate QR code as a data URL
          console.log("QR code generated, scan it through the web interface.");
      }

      if (connection === 'close') {
          if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
              console.log('Connection closed, reconnecting...');
              connectToWA();
          } else {
              console.log('Logged out from WhatsApp');
          }
      } else if (connection === 'open') {
          console.log('😼 Installing... ');
          const path = require('path');
          fs.readdirSync("./commands/").forEach((plugin) => {
              if (path.extname(plugin).toLowerCase() == ".js") {
                  require("./commands/" + plugin);
              }
          });
          console.log('Plugins installed successfully ✅');
          console.log('Bot connected to WhatsApp ✅');

          let up = `🎉 Bot is up and running! 🎉`;

          const firstOwner = ownerNumbers[0] + "@s.whatsapp.net"; // Access the first number

          conn.sendMessage(firstOwner, {
              image: { url: `https://telegra.ph/file/c130e7ab66afc462d0448.jpg` },
              caption: up
          });
      }
  });

  // Save credentials whenever they're updated
  conn.ev.on('creds.update', saveCreds);

  // Handle incoming messages (omitted for brevity)
  // ...
}

// Express route to show QR code
app.get("/", (req, res) => {
  if (qrCodeDataURL) {
      res.send(`<img src="${qrCodeDataURL}" alt="Scan QR Code to login">`);
  } else {
      res.send("QR code not generated yet, please wait...");
  }
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(() => {
  connectToWA();
}, 4000);
