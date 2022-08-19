import fetch from 'node-fetch';
export default class MemeScraper {
    apiURL = 'https://meme-api.herokuapp.com/gimme';
    async run(): Promise<string> {
        const response = await fetch(this.apiURL);
        const json = await response.json();
        return json.url as string;
    }
}
