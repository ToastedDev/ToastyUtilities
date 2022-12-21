import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { MessageCommand, SlashCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user Id to unban. Example: 955408387905048637")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the unban.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  run: async ({ interaction }) => {
    const userID = interaction.options.getUser("user")?.id;
    if (!userID)
      return interaction.reply({
        embeds: [new FailEmbed("Invalid user ID.")],
        ephemeral: true,
      });

    const ban =
      interaction.guild.bans.cache.get(userID) ||
      (await interaction.guild.bans.fetch(userID).catch(() => null));
    if (!ban)
      return interaction.reply({
        embeds: [new FailEmbed("That user isn't banned in this server.")],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    interaction.guild.members.unban(userID, reason).then((user) => {
      interaction.reply({
        embeds: [new SuccessEmbed(`**${user.tag}** was unbanned.`)],
      });
    });
  },
});
