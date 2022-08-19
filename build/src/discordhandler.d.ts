import { Client } from 'discord.js';
import MemeScraper from './memescraper';
export default class DiscordHandler {
    client: Client<boolean>;
    memescraper: MemeScraper;
    ratingMap: Map<any, any>;
    rate(messageId: string, positive: boolean): void;
    constructor(token: string);
}
