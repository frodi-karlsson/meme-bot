import DiscordHandler from "./discordhandler";
import { config } from "dotenv";
config();
const discordHandler = new DiscordHandler(process.env.DISCORD_SECRET!); // Create a new DiscordHandler instance that starts the bot