import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { colors } from "../../config";
import { SlashCommand } from "../../structures/Command";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite me to your server."),
  run: ({ client, interaction }) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Invite links")
          .setDescription(
            `[Recommended invite link](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1099914307606&scope=bot%20applications.commands)\n[Admin invite link](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1099914307614&scope=bot%20applications.commands)`
          )
          .setColor(colors.main),
      ],
      ephemeral: true,
    });
  },
});
