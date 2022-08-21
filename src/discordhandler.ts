import { Client, Message, MessageReaction, User } from 'discord.js';
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
                this.handleReply(message);
            } else if(words[0].toLowerCase() === '!meme') {
                this.sendMeme(message, words);
            } else if(message.content.toLowerCase() === "!memehelp"){
                message.channel.send("!meme - sends a meme\n!memehelp - this help message\nReplying to a meme with +2 or -2 will rate it up or down\nReplying to a meme with cringe deletes it");
            }
            
            if(meme != "") {
                const msg: Message = await message.channel.send(meme + "\nRating: " + (this.ratingMap.get(message.id) ?? "0"));
                const letUrDreamsEmoji = '1010914891080683551';
                const chugJugMomentEmoji = '1010915040574062623';
                if(letUrDreamsEmoji) msg.react(letUrDreamsEmoji);
                if(chugJugMomentEmoji) msg.react(chugJugMomentEmoji);

            } 
        }).on('messageReactionAdd', async (reaction, user) => {
            if(!reaction.partial && !user.partial) this.handleReaction(reaction, user);
        });
    }

    private async handleReaction(reaction: MessageReaction, user: User) {
        if(reaction.message.channel.id !== "1010075098176307282" || user.id === this.client.user!.id || reaction.message.author !== this.client.user) return;
        if(reaction.emoji.name === 'leturmemesbedreams' || reaction.emoji.name === 'chugjugmoment') {
            this.rate(reaction.message.id, reaction.emoji.name === 'chugjugmoment');
            reaction.message.edit(reaction.message.content?.split("\n").slice(0, -1).join("\n") + "\nRating: " + (this.ratingMap.get(reaction.message.id) ?? "0"));
            reaction.remove();
        }
        
    }

    private async handleReply(message: Message) {
        const repliedID = message.reference?.messageId;
        if(repliedID) {
            const repliedMessage = await message.channel.messages.fetch(repliedID);
            if(repliedMessage.author.id === message.author.id && message.content === "!meme") {
                this.sendMeme(repliedMessage, repliedMessage.content.split(" "));
            }
        }
    }

    private async sendMeme(message: Message, words: string[]) {
        const author = message.author;
        let meme = "";
        if(message.attachments.size > 0) {
            meme = message.attachments.first()!.url + "\nDonated by " + author.username;
        } else if (words.length > 1 && words[1].slice(0, 4) === 'http') {
            meme = words[1] + "\nDonated by " + author.username;
        } else if (words[0].slice(0, 4) === 'http') {
            meme = words[0] + "\nDonated by " + author.username;
        } else {
            meme = await this.memescraper.run() + "\nRequested by " + author.username;
        }
        message.delete();
        if(meme != "") message.channel.send(meme + "\nRating: " + (this.ratingMap.get(message.id) ?? "0"));
    }
}