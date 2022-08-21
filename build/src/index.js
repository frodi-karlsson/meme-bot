"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const discordhandler_1 = require("./discordhandler");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const discordHandler = new discordhandler_1.default(process.env.DISCORD_SECRET); // Create a new DiscordHandler instance that starts the bot
const express = require('express');
const app = express();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map