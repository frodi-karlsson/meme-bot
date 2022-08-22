import { Client, Message, MessageReaction, User } from 'discord.js';
import MemeScraper from './memescraper';

class MapStack {
    private map: Map<string, number>;
    private added: string[] = [];

    constructor() {
        this.map = new Map();
    }

    private removeFirst(): void {
        this.map.delete(this.added[0]);
        this.added.shift();
    }

    public edit(key: string, value: number): void {
        if (this.map.has(key)) {
            this.map.set(key, (this.map.get(key)! + value));
        } else {
            this.map.set(key, value);
            this.added.push(key);
            if (this.added.length > 10000) {
                this.removeFirst();
            }
        }
    }

    public getOrElse(key: string, defaultValue: number): number {
        if (this.map.has(key)) {
            return this.map.get(key)!;
        } else {
            return defaultValue;
        }
    }

    public get(key: string): number {
        return this.map.get(key)!;
    }

}

export default class DiscordHandler {
    client = new Client({
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING'],
    });
    memescraper = new MemeScraper(); // Create a new MemeScraper instance that scrapes memes
    ratingMap = new MapStack();
    rate(messageId: string, positive: boolean){
        if(positive){
            this.ratingMap.edit(messageId, 2);
        } else {
            this.ratingMap.edit(messageId, -2);
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
            if(message.channel.id !== "1010075098176307282" || message.author.id === this.client.user?.id) return; // only send memes in #memes
            const words = message.content.split(' ');
            if(message.type === 'REPLY') {
                this.handleReply(message);
            } else if(words[0].toLowerCase() === '!meme' || this.isDonation(message)) {
                this.sendMeme(message, words);
            } else if(message.content.toLowerCase() === "!memehelp"){
                message.channel.send("!meme - sends a meme\n!memehelp - this help message\nReplying to a meme with +2 or -2 will rate it up or down\nReplying to a meme with cringe deletes it");
            } else if(message.author !== this.client.user){
                message.delete();
            }
        }).on('messageReactionAdd', async (reaction, user) => {
            if(!reaction.partial && !user.partial) this.handleReaction(reaction, user);
        });
    }

    private async handleReaction(reaction: MessageReaction, user: User) {
        if(reaction.message.channel.id !== "1010075098176307282" || user.id === this.client.user!.id || reaction.message.author !== this.client.user) return;
        if(reaction.emoji.name === 'leturmemesbedreams' || reaction.emoji.name === 'chugjugmoment') {
            this.rate(reaction.message.id, reaction.emoji.name === 'chugjugmoment');
            reaction.message.edit(reaction.message.content?.split("\n").slice(0, -1).join("\n") + "\nRating: " + this.ratingMap.getOrElse(reaction.message.id, 0));
            reaction.users.remove(user);
        }
        
    }

    private async handleReply(message: Message) {
        const repliedID = message.reference?.messageId;
        if(repliedID) {
            const repliedMessage = await message.channel.messages.fetch(repliedID);
            if(repliedMessage.author.id !== this.client.user?.id && message.content === "!meme") {
                this.sendMeme(repliedMessage, repliedMessage.content.split(" "), true);
            } else {
                message.delete();
            }
        }
    }

    private isDonation(message: Message): boolean {
        const words = message.content.split(' ');
        return words.filter(word => word.slice(0, 4) === 'http').length > 0 || message.attachments.size > 0;
    }

    private async donateMeme(message: Message){
        let meme = "";
        if(message.attachments.size > 0){
            meme = message.attachments.first()!.url;
        } else {
            meme = message.content.split(' ').filter(word => word.slice(0, 4) === 'http')[0];
        }
        return meme + "\nDonated by <@" + message.author.id + ">";
    }

    private async sendMeme(message: Message, words: string[], reply?: boolean) {
        const author = message.author;
        let meme = "";
        let toDelete = true;
        if(this.isDonation(message)){
            meme = await this.donateMeme(message);
            toDelete = false;
        } else {
            toDelete = !reply ?? true;
            meme = await this.memescraper.run() + "\nRequested by <@" + author.username + ">";
        }
        if(toDelete) message.delete();
        if(meme != "") {
            const msg = await message.channel.send(meme + "\nRating: " + (this.ratingMap.getOrElse(message.id, 0)));
            const letUrDreamsEmoji = '1010914891080683551';
            const chugJugMomentEmoji = '1010915040574062623';
            msg.react(letUrDreamsEmoji);
            msg.react(chugJugMomentEmoji);
        }
    }
}