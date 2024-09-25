const { cmd } = require('../command');
const { tikdown } = require('nayan-media-downloader');
const config = require('../config');

cmd({
    pattern: "tt",
    alias:["tiktok","tictok","tictoK","ticktoc","ttdl","tdl"],
    desc: "Download videos from TikTok.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const validUrlPattern = /https:\/\/(?:www\.)?tiktok\.com\/.*|https:\/\/vt\.tiktok\.com\/.*/;
        if (!validUrlPattern.test(q)) {
            await m.react("❓");
            return reply("❓Please provide a valid TikTok video URL");
        }
        let result = await tikdown(q);
        if (result.data.duration === 0) { // Check if duration is 0
            await m.react("🚫");
            console.log("⛔️ Currently, Streamline-MD cannot download videos with duration 0");
            return reply("⛔️ Currently, Streamline-MD cannot download videos with duration 0");
        }
        
        //let result = await tikdown(q);
        console.log(result); 

        // Extract the video URL from the response object
        const videoUrl = result.data.video;

        let responce = 
`❍⚯────────────────⚯❍𝗦𝗧𝗥𝗘𝗔𝗠𝗟𝗜𝗡𝗘 𝗧𝗞 𝗗𝗢𝗪𝗡❍⚯────────────────⚯❍

🔗 URL: *_${q}_*

🎥 Video Title: *_${result.data.title}_*
⏱ Duration: *_${result.data.duration}_* s

${config.BOTTOM_FOOTER}`
        
        m.react("🎥")
        conn.sendMessage(from, { video: { url: videoUrl }, mimetype: "video/mp4", caption: responce }, { quoted: mek });
        
    } catch (error) {
        console.error(error);
        const errorMessage = error.message ? error.message : "An error occurred while downloading the video.";
        await m.reply(errorMessage);
        await m.react("⚠️");
    }
});
