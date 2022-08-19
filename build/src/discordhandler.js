"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const memescraper_1 = require("./memescraper");
class DiscordHandler {
    constructor(token) {
        this.client = new discord_js_1.Client({
            intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING'],
        });
        this.memescraper = new memescraper_1.default(); // Create a new MemeScraper instance that scrapes memes
        this.ratingMap = new Map();
        this.client.login(token);
        this.client.on('ready', () => {
            if (this.client.user) {
                console.log(`Logged in as ${this.client.user.tag}!`);
            }
            else {
                console.log('No user found');
            }
        }).on('messageCreate', async (message) => {
            var _a, _b, _c, _d, _e;
            if (message.channel.id !== "1010075098176307282")
                return; // only send memes in #memes
            const words = message.content.split(' ');
            let meme = "";
            if (message.type === 'REPLY') {
                const repliedID = await ((_a = message.reference) === null || _a === void 0 ? void 0 : _a.messageId);
                if (repliedID) {
                    const repliedMessage = await message.channel.messages.fetch(repliedID);
                    if (message.content === 'cringe' && repliedID && repliedMessage && repliedMessage.content.includes('Rating: ') && repliedMessage.author.id === ((_b = this.client.user) === null || _b === void 0 ? void 0 : _b.id)) {
                        await repliedMessage.delete();
                    }
                    else if (message.content === '+2' || message.content === '-2' && repliedMessage && repliedMessage.author.id === ((_c = this.client.user) === null || _c === void 0 ? void 0 : _c.id) && repliedMessage.content.slice(0, 4) === 'http') {
                        const positive = message.content === '+2';
                        this.rate(repliedID, positive);
                        await repliedMessage.edit(repliedMessage.content.split("\n").slice(0, -1).join("\n") + "\nRating: " + ((_d = this.ratingMap.get(repliedID)) !== null && _d !== void 0 ? _d : "0"));
                    }
                    else if (repliedMessage.author.id === message.author.id && message.content === "!meme") {
                        if (repliedMessage.attachments.size > 0) {
                            meme = repliedMessage.attachments.first().url + "\nDonated by " + message.author.username;
                            await repliedMessage.delete();
                        }
                        else if (repliedMessage.content.slice(0, 4) === 'http') {
                            meme = repliedMessage.content.split(" ")[0] + "\nDonated by " + message.author.username;
                            await repliedMessage.delete();
                        }
                    }
                    await message.delete();
                }
            }
            else if (words[0] === '!meme') {
                if (words.length > 1 && words[1].slice(0, 4) === 'http') {
                    meme = words[1] + "\nDonated by " + message.author.username;
                    message.delete();
                }
                else if (message.attachments.size > 0) {
                    meme = message.attachments.first().url + "\nDonated by " + message.author.username;
                    message.delete();
                }
                else {
                    meme = await this.memescraper.run();
                }
            }
            else if (message.content === "!memehelp") {
                message.channel.send("!meme - sends a meme\n!memehelp - this help message\nReplying to a meme with +2 or -2 will rate it up or down\nReplying to a meme with cringe deletes it");
            }
            if (meme != "")
                message.channel.send(meme + "\nRating: " + ((_e = this.ratingMap.get(message.id)) !== null && _e !== void 0 ? _e : "0"));
        });
    }
    rate(messageId, positive) {
        var _a, _b;
        if (positive) {
            this.ratingMap.set(messageId, ((_a = this.ratingMap.get(messageId)) !== null && _a !== void 0 ? _a : 0) + 2);
        }
        else {
            this.ratingMap.set(messageId, ((_b = this.ratingMap.get(messageId)) !== null && _b !== void 0 ? _b : 0) - 2);
        }
    }
}
exports.default = DiscordHandler;
//# sourceMappingURL=discordhandler.js.map