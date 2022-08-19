"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class MemeScraper {
    constructor() {
        this.apiURL = 'https://meme-api.herokuapp.com/gimme';
    }
    isMemeResponse(response) {
        return response.url !== undefined;
    }
    async run() {
        const response = await axios_1.default.get(this.apiURL);
        const json = await response.data;
        if (json && this.isMemeResponse(json)) {
            return json.url;
        }
        else {
            return "";
        }
    }
}
exports.default = MemeScraper;
//# sourceMappingURL=memescraper.js.map