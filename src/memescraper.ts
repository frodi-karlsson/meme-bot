import axios from 'axios';

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
    subreddits = [
        "dankmemes",
        "surrealmemes",
        "okbuddyretard",
        "memes",
        "terriblefacebookmemes",
        "antimeme",
        "wholesomememes",
        "jerma985",
    ]
    private getRandomSubreddit(): string {
        return this.subreddits[Math.floor(Math.random() * this.subreddits.length)];
    }
    private getRandomSubredditLink(): string {
        return this.apiURL + '/' + this.getRandomSubreddit();
    }
    private getSubredditLink(subreddit: string): string {
        return this.apiURL + '/' + subreddit;
    }
    private isMemeResponse(response: any): response is MemeResponse {
        return response.url !== undefined && response.subreddit !== undefined && response.title !== undefined;
    }
    async run(subreddit?: string): Promise<string> {
        const response = await axios.get(subreddit ? this.getSubredditLink(subreddit) : this.getRandomSubredditLink());
        const json = await response.data;
        if(json && this.isMemeResponse(json)) {
            return json.url + '\nTitle: ' + json.title + '\nSubreddit: ' + json.subreddit;
        } else {
            return "";
        }
    }
}
