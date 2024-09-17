const menuMessageIds = new Map(); // Store the message IDs and related data (like `down` object)

// Search and send the search result
cmd({
    pattern: "play",
    desc: "play or download a song or a video",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        // Prompt for missing query
        if (!q) {
            return reply("❓ *Please provide a URL or title.*\n🌐 *Example:* https://example.com or 'Sample Title'");
        }

        // Perform YouTube search
        const search = await yts(q);
        const data = search.videos[0];

        // Error if no result found
        if (!data) {
            return reply("❌ *Error:* No results found.");
        }

        // Extract data
        const url = data.url;
        const desc = `🎧 YT SEARCH 🎬 \n\n🔎 Searching for: *${q}*\n\nTitle: ${data.title}\n\n🔗 Watch it here: ${url}`;

        // Send search result message
        const searchMessage = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Perform download via API (yt-audio/video)
        let down = await fg.yta(url);
        if (!down || !down.dl_url) return reply("Failed to get the download URL.");

        // Save message ID and the download data
        menuMessageIds.set(from, { messageId: searchMessage.key.id, down });
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

// Reply handler to manage user responses
cmd({
    on: "body"
}, async (conn, mek, m, { from, body, reply }) => {
    try {
        // Check if a reply exists for the message ID
        const savedData = menuMessageIds.get(from);
        if (!savedData) return; // No tracked message

        const { messageId, down } = savedData;

        // Check if the reply is to the correct message
        if (!m.quoted || m.quoted.id !== messageId) return; // User didn't reply to the correct message

        // Parse the reply (e.g., 1 for audio, 2 for video)
        const selectedOption = parseInt(body);
        if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > 4) {
            return reply("Please enter a valid number between 1 and 4.");
        }

        // Handle download options based on user input
        switch (selectedOption) {
            case 1:
                await conn.sendMessage(from, { document: { url: down.dl_url }, mimetype: 'audio/mp3', fileName: `${down.title}.mp3` }, { quoted: m });
                break;
            case 2:
                let downVideo = await fg.ytv(down.url);
                await conn.sendMessage(from, { document: { url: downVideo.dl_url }, mimetype: 'video/mp4', fileName: `${down.title}.mp4` }, { quoted: m });
                break;
            case 3:
                await conn.sendMessage(from, { audio: { url: down.dl_url }, mimetype: 'audio/mp4' }, { quoted: m });
                break;
            case 4:
                let downVideoDoc = await fg.ytv(down.url);
                await conn.sendMessage(from, { video: { url: downVideoDoc.dl_url }, mimetype: 'video/mp4' }, { quoted: m });
                break;
            default:
                reply("Invalid option. Please choose 1 (Audio), 2 (Video), 3 (Audio Doc), or 4 (Video Doc).");
        }

        // Clear the saved message ID after use
        menuMessageIds.delete(from);
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

        reply(`Error: ${e.message}`);
    }
});
