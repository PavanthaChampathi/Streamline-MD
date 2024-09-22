const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "binance",
    desc: "Get current cryptocurrency prices from Binance.",
    category: "useful",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    try {
        const { data } = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        reply(`🪙 Bitcoin Price: ${data.price} USD`);
    } catch (e) {
        reply(`⚠️ Error: ${e.message}`);
    }
});
