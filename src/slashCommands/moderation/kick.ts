import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the kick.")
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
    if (!member.kickable)
      return interaction.reply({
        embeds: [new FailEmbed("I don't have permission to kick that user.")],
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

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    member.kick(reason);

    interaction.reply({
      embeds: [new SuccessEmbed(`**${member.user.tag}** was kicked.`)],
    });
  },
});
