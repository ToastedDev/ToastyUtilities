import { ActivityType } from "discord.js";
import { prefix } from "../config";
import { Event } from "../structures/Event";

export default new Event({
  name: "shardReady",
  run: (client, id) => {
    console.log(`Launched shard #${id}.`);

    client.user.setActivity({
      name: `${prefix}help | Shard #${id}`,
      type: ActivityType.Watching,
      shardId: id,
    });
  },
});
