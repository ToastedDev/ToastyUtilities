import { EmbedBuilder } from "discord.js";
import { colors } from "../../config";
import { MessageCommand } from "../../structures/Command";

export default new MessageCommand({
  name: "invite",
  description: "Invite me to your server.",
  aliases: ["add"],
  run: ({ client, message }) => {
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Invite links")
          .setDescription(
            `[Recommended invite link](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1099914307606&scope=bot%20applications.commands)\n[Admin invite link](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1099914307614&scope=bot%20applications.commands)`
          )
          .setColor(colors.main),
      ],
    });
  },
});
