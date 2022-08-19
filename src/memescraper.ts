import fetch from 'node-fetch';

interface MemeResponse {
    postlink: string;
    subreddit: string;
    title: string;
    url: string;
    nsfw: string;
    spoiler: boolean;
    author: string;
    ups: number;
    preview: string[];
}

export default class MemeScraper {
    apiURL = 'https://meme-api.herokuapp.com/gimme';
    private isMemeResponse(response: any): response is MemeResponse {
        return response.url !== undefined ;
    }
    async run(): Promise<string> {
        const response = await fetch(this.apiURL);
        const json = await response.json();
        if(json && this.isMemeResponse(json)) {
            return json.url as string;
        } else {
            return "";
        }
    }
}
