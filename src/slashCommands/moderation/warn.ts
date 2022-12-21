import { SlashCommand } from "../../structures/Command";
import Warn from "../../schemas/Warns";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to warn.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the warn.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  run: async ({ interaction }) => {
    const member = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );
    if (!member)
      return interaction.reply({
        embeds: [new FailEmbed("I couldn't find that user.")],
        ephemeral: true,
      });
    if (member.permissions.has(["KickMembers", "Administrator"]))
      return interaction.reply({
        embeds: [new FailEmbed("That user is a mod/admin, I can't do that.")],
        ephemeral: true,
      });
    if (!member.manageable)
      return interaction.reply({
        embeds: [new FailEmbed("I don't have permission to warn that user.")],
        ephemeral: true,
      });
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        embeds: [
          new FailEmbed("That user has roles that are higher/equal to yours."),
        ],
        ephemeral: true,
      });

    const reason = interaction.options.getString("reason") ?? undefined;

    Warn.create({
      guild: interaction.guild.id,
      user: member.id,
      moderator: interaction.user.id,
      reason,
    });

    interaction.reply({
      embeds: [new SuccessEmbed(`**${member.user.tag}** was warned.`)],
    });
  },
});
