import { Client } from 'discord.js';
import MemeScraper from './memescraper';

export default class DiscordHandler {
    client = new Client({
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING'],
    });
    memescraper = new MemeScraper(); // Create a new MemeScraper instance that scrapes memes
    ratingMap = new Map();
    rate(messageId: string, positive: boolean){
        if(positive){
            this.ratingMap.set(messageId, (this.ratingMap.get(messageId) ?? 0) + 2);
        } else {
            this.ratingMap.set(messageId, (this.ratingMap.get(messageId) ?? 0) - 2);
        }
    }
    constructor(token: string) {
        this.client.login(token);
        this.client.on('ready', () => {
            if(this.client.user) {
                console.log(`Logged in as ${this.client.user.tag}!`);
            } else {
                console.log('No user found');
            }
        }).on('messageCreate', async (message) => { // on !meme command send a meme
            if(message.channel.id !== "1010075098176307282") return; // only send memes in #memes
            const words = message.content.split(' ');
            let meme = "";
            if(message.type === 'REPLY') {
                const repliedID = await message.reference?.messageId;
                if(repliedID) {
                    const repliedMessage = await message.channel.messages.fetch(repliedID);
                    if (message.content === 'cringe' && repliedID && repliedMessage && repliedMessage.content.includes('Rating: ') && repliedMessage.author.id === this.client.user?.id) {
                        await repliedMessage.delete();
                    } else if (message.content === '+2' || message.content === '-2' && repliedMessage && repliedMessage.author.id === this.client.user?.id && repliedMessage.content.slice(0, 4) === 'http') {
                        const positive = message.content === '+2';
                        this.rate(repliedID, positive);
                        await repliedMessage.edit(repliedMessage.content.split("\n").slice(0, -1).join("\n") + "\nRating: " + (this.ratingMap.get(repliedID) ?? "0"));
                    } else if(repliedMessage.author.id === message.author.id && message.content === "!meme") {
                        if(repliedMessage.attachments.size > 0) {
                            meme = repliedMessage.attachments.first()!.url + "\nDonated by " + message.author.username;
                            await repliedMessage.delete();
                        } else if (repliedMessage.content.slice(0, 4) === 'http') {
                            meme = repliedMessage.content.split(" ")[0] + "\nDonated by " + message.author.username;
                            await repliedMessage.delete();
                        }
                    }
                    await message.delete();
                }
            } else if(words[0] === '!meme') {
                if(words.length > 1 && words[1].slice(0, 4) === 'http') {
                    meme = words[1] + "\nDonated by " + message.author.username;
                    message.delete();
                } else if(message.attachments.size > 0) {
                    meme = message.attachments.first()!.url + "\nDonated by " + message.author.username;
                    message.delete();
                } else {
                    meme = await this.memescraper.run();
                }
            } else if(message.content === "!memehelp"){
                message.channel.send("!meme - sends a meme\n!memehelp - this help message\nReplying to a meme with +2 or -2 will rate it up or down\nReplying to a meme with cringe deletes it");
            }
            if(meme != "") message.channel.send(meme + "\nRating: " + (this.ratingMap.get(message.id) ?? "0"));
            
        });
    }



}

