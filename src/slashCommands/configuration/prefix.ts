import { SlashCommand } from "../../structures/Command";
import prefixes from "../../schemas/Prefix";
import { SuccessEmbed } from "../../structures/Embed";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Change the prefix for this server.")
    .addStringOption((option) =>
      option
        .setName("new_prefix")
        .setDescription("The new prefix.")
        .setMaxLength(5)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  run: async ({ interaction }) => {
    const newPrefix = interaction.options.getString("new_prefix");

    await prefixes.findOneAndUpdate(
      { guild: interaction.guild.id },
      { $set: { prefix: newPrefix } }
    );

    interaction.reply({
      embeds: [new SuccessEmbed(`Updated server prefix to \`${newPrefix}\`.`)],
      ephemeral: true,
    });
  },
});
