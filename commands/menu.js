const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd, commands } = require('../command');

// Path to images directory
const IMG_PATH = path.join(__dirname, '../images');

// Map to store menu message IDs for each user
const menuMessageIds = new Map();

/**
 * Formats the command list for display.
 * @param {string} commandList - Commands separated by newlines.
 * @returns {string} - Formatted command string.
 */
const formatCommands = (commandList) => {
    if (!commandList) {
        return '║  No commands available.\n';
    }

    return commandList
        .split('\n')
        .filter(cmd => cmd.trim())
        .map(cmd => `║------- ${cmd}`)
        .join('\n') + '\n';
};

// Menu Command Handler
cmd({
    pattern: "menu",
    desc: "Get command list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {

        // Initialize menu object with all possible categories
        const menu = {
            owner: '',
            convert: '',
            ai: '',
            search: '',
            download: '',
            mathtool: '',
            main: '',
            group: '',
            sticker: '',
            game: ''
        };

        // Populate the menu object with commands categorized
        commands.forEach(cmdItem => {
            if (cmdItem.pattern && !cmdItem.dontAddCommandList) {
                const category = cmdItem.category.toLowerCase();
                if (menu[category] !== undefined) {
                    menu[category] += `${config.PREFIX}${cmdItem.pattern}\n`;
                }
            }
        });

        // Define menu categories with numbers
        const categories = [
            { number: 1, name: 'OWNER' },
            { number: 2, name: 'CONVERT' },
            { number: 3, name: 'AI' },
            { number: 4, name: 'SEARCH' },
            { number: 5, name: 'DOWNLOAD' },
            { number: 6, name: 'MATHTOOL' },
            { number: 7, name: 'MAIN' },
            { number: 8, name: 'GROUP' },
            { number: 9, name: 'STICKER' },
            { number: 10, name: 'GAME' }
        ];

        // Create the menu message
        let madeMenu = `╔═〘 ᴡᴇʟᴄᴏᴍᴇ, ${pushname} 〙═╗
║  
╠═〘 ᴄᴏᴍᴍᴀɴᴅꜱ 〙═
║  
`;

        categories.forEach(category => {
            madeMenu += `║  ${category.number}  ${category.name}\n`;
        });

        madeMenu += `╚═━─────●●►

🌟 *Reply with the Number you want to select*`;

        // React to the menu command
        m.react("📜");

        // Send the menu message with an image
        const menuMessage = await conn.sendMessage(from, {
            image: { url: path.join(IMG_PATH, 'BOTLOGOL_IMG.png') },
            caption: madeMenu
        }, { quoted: mek });

        // Store the message ID to verify replies
        menuMessageIds.set(from, menuMessage.key.id);

    } catch (e) {
        console.error(e);
        reply && reply(`Error: ${e.message}`);
    }
});

// Menu Reply Handler
cmd({
    on: "body"
}, async (conn, mek, m, { from, body, reply }) => {
    try {
        // Retrieve the stored menu message ID
        const menuMessageId = menuMessageIds.get(from);
        if (!menuMessageId) return; // No active menu for this user

        // Check if the message is a reply to the menu message
        if (!m.quoted || m.quoted.id !== menuMessageId) return;

        // Parse the user's selection
        const selectedOption = parseInt(body.trim());
        if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > 10) {
            return reply("❌ Please enter a valid number between 1 and 10.");
        }

        // Define the categories with their corresponding keys
        const categoryKeys = {
            1: 'owner',
            2: 'convert',
            3: 'ai',
            4: 'search',
            5: 'download',
            6: 'mathtool',
            7: 'main',
            8: 'group',
            9: 'sticker',
            10: 'game'
        };

        // Retrieve the commands for the selected category
        const selectedCategory = categoryKeys[selectedOption];
        if (!selectedCategory) {
            return reply("❌ Invalid category selected.");
        }

        // Initialize menu object with all possible categories
        const menu = {
            owner: '',
            convert: '',
            ai: '',
            search: '',
            download: '',
            mathtool: '',
            main: '',
            group: '',
            sticker: '',
            game: ''
        };

        // Populate the menu object with commands categorized
        commands.forEach(cmdItem => {
            if (cmdItem.pattern && !cmdItem.dontAddCommandList) {
                const category = cmdItem.category.toLowerCase();
                if (menu[category] !== undefined) {
                    menu[category] += `${config.PREFIX}${cmdItem.pattern}\n`;
                }
            }
        });

        // Format the commands for the selected category
        const formattedCommands = formatCommands(menu[selectedCategory]);

        // Define content for each category
        const menuContent = {
            owner: `╔═〘 OWNER 〙═╗\n║\n${formattedCommands}║\n╚═━─────●●►`,
            convert: `╔═〘 CONVERT 〙═╗\n║\n║  No commands available.\n╚═━─────●●►`,
            ai: `╔═〘 AI 〙═╗\n║\n${formattedCommands}║\n╚═━─────●●►`,
            search: `╔═〘 SEARCH 〙═╗\n║\n${formattedCommands}║\n╚═━─────●●►`,
            download: `╔═〘 DOWNLOAD 〙═╗\n║\n${formattedCommands}║\n╚═━─────●●►`,
            mathtool: `╔═〘 MATHTOOL 〙═╗\n║\n║  No commands available.\n╚═━─────●●►`,
            main: `╔═〘 MAIN 〙═╗\n║\n${formattedCommands}║\n╚═━─────●●►`,
            group: `╔═〘 GROUP 〙═╗\n║\n${formattedCommands}║\n╚═━─────●●►`,
            sticker: `╔═〘 STICKER 〙═╗\n║\n║  No commands available.\n╚═━─────●●►`,
            game: `╔═〘 GAME 〙═╗\n║\n║  No commands available.\n╚═━─────●●►`
        };

        // Fetch the appropriate content
        const responseContent = menuContent[selectedCategory] || '║  No commands available.\n';

        // Send the response
        await conn.sendMessage(from, { text: responseContent }, { quoted: m });

    } catch (e) {
        console.error(e);
        reply && reply(`Error: ${e.message}`);
    }
});
