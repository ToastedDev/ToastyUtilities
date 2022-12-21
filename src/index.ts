import "dotenv/config";

import { BotClient } from "./structures/BotClient";
import { ActivityType } from "discord.js";
import { prefix } from "./config";

const client = new BotClient(process.env.TOKEN, {
  shards: "auto",
  presence: {
    activities: [
      {
        name: `${prefix}help`,
        type: ActivityType.Watching,
      },
    ],
  },
});

client.connect();
client.register();
