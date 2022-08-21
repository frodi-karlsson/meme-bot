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
            if (message.channel.id !== "1010075098176307282")
                return; // only send memes in #memes
            const words = message.content.split(' ');
            if (message.type === 'REPLY') {
                this.handleReply(message);
            }
            else if (words[0].toLowerCase() === '!meme') {
                this.sendMeme(message, words);
            }
            else if (message.content.toLowerCase() === "!memehelp") {
                message.channel.send("!meme - sends a meme\n!memehelp - this help message\nReplying to a meme with +2 or -2 will rate it up or down\nReplying to a meme with cringe deletes it");
            }
        }).on('messageReactionAdd', async (reaction, user) => {
            if (!reaction.partial && !user.partial)
                this.handleReaction(reaction, user);
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
    async handleReaction(reaction, user) {
        var _a, _b;
        if (reaction.message.channel.id !== "1010075098176307282" || user.id === this.client.user.id || reaction.message.author !== this.client.user)
            return;
        if (reaction.emoji.name === 'leturmemesbedreams' || reaction.emoji.name === 'chugjugmoment') {
            this.rate(reaction.message.id, reaction.emoji.name === 'chugjugmoment');
            reaction.message.edit(((_a = reaction.message.content) === null || _a === void 0 ? void 0 : _a.split("\n").slice(0, -1).join("\n")) + "\nRating: " + ((_b = this.ratingMap.get(reaction.message.id)) !== null && _b !== void 0 ? _b : "0"));
            reaction.users.remove(user);
        }
    }
    async handleReply(message) {
        var _a;
        const repliedID = (_a = message.reference) === null || _a === void 0 ? void 0 : _a.messageId;
        if (repliedID) {
            const repliedMessage = await message.channel.messages.fetch(repliedID);
            if (repliedMessage.author.id === message.author.id && message.content === "!meme") {
                this.sendMeme(repliedMessage, repliedMessage.content.split(" "));
            }
        }
    }
    async sendMeme(message, words) {
        var _a;
        const author = message.author;
        let meme = "";
        let toDelete = true;
        if (message.attachments.size > 0) {
            meme = message.attachments.first().url + "\nDonated by " + author.username;
        }
        else if (words.length > 1 && words[1].slice(0, 4) === 'http') {
            meme = words[1] + "\nDonated by " + author.username;
        }
        else if (words[0].slice(0, 4) === 'http') {
            meme = words[0] + "\nDonated by " + author.username;
        }
        else {
            toDelete = false;
            meme = await this.memescraper.run() + "\nRequested by " + author.username;
        }
        if (toDelete)
            message.delete();
        if (meme != "") {
            const msg = await message.channel.send(meme + "\nRating: " + ((_a = this.ratingMap.get(message.id)) !== null && _a !== void 0 ? _a : "0"));
            const letUrDreamsEmoji = '1010914891080683551';
            const chugJugMomentEmoji = '1010915040574062623';
            msg.react(letUrDreamsEmoji);
            msg.react(chugJugMomentEmoji);
        }
    }
}
exports.default = DiscordHandler;
//# sourceMappingURL=discordhandler.js.map