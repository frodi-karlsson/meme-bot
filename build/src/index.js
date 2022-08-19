"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discordhandler_1 = require("./discordhandler");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const discordHandler = new discordhandler_1.default(process.env.DISCORD_SECRET); // Create a new DiscordHandler instance that starts the bot
//# sourceMappingURL=index.js.map