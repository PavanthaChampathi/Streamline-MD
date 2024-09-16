const {cmd , commands} = require('../command')
const config = require('../config')
const yts = require('yt-search');
const fg = require('api-dylux');

cmd({
    pattern: "play",
    desc: "play or downlode a song or a video",
    category: "downlode",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
        try {
            // Function to format numbers
            function formatNumber(num) {
                if (num >= 1_000_000) {
                    return `${(num / 1_000_000).toFixed(1)}M`;
                } else if (num >= 1_000) {
                    return `${(num / 1_000).toFixed(1)}K`;
                } else {
                    return num.toString();
                }
            }
    
            // Prompt message for missing query
            const promptMessage = 
`🔍 *Please provide a URL or title.*
🌐 *Example:* https://example.com or "Sample Title"`;
    
            if (!q) {
                m.react("❓");
                return reply(promptMessage);
            }
    
            // Perform the YouTube search
            const search = await yts(q);
            const data = search.videos[0];
    
            // Error message for no results
            const errorMessage = 
`❌ *Error:* No results found.
🔗 *Hint:* Please provide a valid URL or title.`;
    
            if (!data) {
                m.react("❓");
                return reply(errorMessage);
            }
            m.react("📺");
    
            // Extracting details and formatting the view count
            const url = data.url;
            const formattedViews = formatNumber(data.views);
            const qser = q.startsWith('https://') ? q : `*_${q.toUpperCase()}_*`;
    
            // Constructing the description message
            const desc = 
`🌐 Streamline-MD 🌟
🎧 YT SEARCH 🎬 
    
🔎 Searching for: ${qser}
🎥 Here’s what I found:
    
Title       : ${data.title}

Time        : ${data.timestamp}m
Ago         : ${data.ago}
Views       : ${formattedViews}

🔗 Watch it here: ${url}

To Get The Files Send:

1 🎶 For Audio
2 🎬 For Video
3 🎵 For Audio Doc
4 📹 For Video Doc 
           
${config.BOTTOM_FOOTER}`;
    
            await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });
            let down = await fg.yta(url); // Await the promise returned by fg.yta
            if (!down || !down.dl_url) return reply("Failed to get the download URL.");
    
        } catch (e) {
            console.error(e);
            reply(`${e}`);
        }

}catch(e){
console.log(e)
reply(`${e}`)
}
})