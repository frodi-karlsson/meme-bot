"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
class MemeScraper {
    constructor() {
        this.apiURL = 'https://meme-api.herokuapp.com/gimme';
    }
    async run() {
        const response = await (0, node_fetch_1.default)(this.apiURL);
        const json = await response.json();
        return json.url;
    }
}
exports.default = MemeScraper;
//# sourceMappingURL=memescraper.js.map