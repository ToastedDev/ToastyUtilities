import "dotenv/config";

import { BotClient } from "./structures/BotClient";

const client = new BotClient(process.env.TOKEN);

client.connect();
client.register();
