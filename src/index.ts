import DiscordHandler from "./discordhandler";
import { config } from "dotenv";
config();
const discordHandler = new DiscordHandler(process.env.DISCORD_SECRET!); // Create a new DiscordHandler instance that starts the bot
const express = require('express')
const app = express()
const port = process.env.PORT ?? 3000

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})
​
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})