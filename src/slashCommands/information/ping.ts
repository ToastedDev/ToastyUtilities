import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { colors } from "../../config";
import { SlashCommand } from "../../structures/Command";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings the bot."),
  run: async ({ client, interaction }) => {
    const res = await interaction.deferReply({
      ephemeral: true,
      fetchReply: true,
    });

    const ping = res.createdTimestamp - interaction.createdTimestamp;

    interaction.followUp({
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
