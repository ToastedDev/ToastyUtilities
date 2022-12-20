import { EmbedBuilder } from "discord.js";
import { colors } from "../../config";
import { MessageCommand } from "../../structures/Command";

export default new MessageCommand({
  name: "ping",
  run: async ({ client, message }) => {
    const res = await message.channel.send("Pinging...");

    const ping = res.createdTimestamp - message.createdTimestamp;

    res.edit({
      content: null,
      embeds: [
        new EmbedBuilder()
          .addFields(
            {
              name: "🤖 Bot",
              value: `${ping}ms`,
            },
            {
              name: "📶 API",
              value: `${client.ws.ping}ms`,
            }
          )
          .setColor(colors.main),
      ],
    });
  },
});
