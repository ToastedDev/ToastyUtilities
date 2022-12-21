import {
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import ms from "ms";
import { SlashCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mute.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The amount of time to mute the user for.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for the mute.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  run: async ({ interaction }) => {
    const member = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );
    if (!member)
      return interaction.reply({
        embeds: [new FailEmbed("I couldn't find that user.")],
        ephemeral: true,
      });
    if (member.permissions.has(["ModerateMembers", "Administrator"]))
      return interaction.reply({
        embeds: [new FailEmbed("That user is a mod/admin, I can't do that.")],
      });
    if (!member.moderatable)
      return interaction.reply({
        embeds: [new FailEmbed("I don't have permission to mute that user.")],
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
    if (member.isCommunicationDisabled())
      return interaction.reply({
        embeds: [new FailEmbed("That user is already muted.")],
      });

    const time = ms(interaction.options.getString("time"));
    if (!time)
      return interaction.reply({
        embeds: [new FailEmbed("Please specify a valid time.")],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    (member as GuildMember).timeout(time, reason);

    interaction.reply({
      embeds: [
        new SuccessEmbed(`**${(member as GuildMember).user.tag}** was muted.`),
      ],
    });
  },
});
