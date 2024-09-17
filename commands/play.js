        // Send message with search result and track its ID

        const searchMessage = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        let down = await fg.yta(url); // Await the promise returned by fg.yta

        if (!down || !down.dl_url) return reply("Failed to get the download URL.");

        menuMessageIds.set(from, searchMessage.key.id); // Save the message ID to check replies you have to pass the down to the bottom comand
