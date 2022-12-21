import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { colors, emotes } from "../../config";
import Warns from "../../schemas/Warns";
import { SlashCommand } from "../../structures/Command";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("View a user's warnings.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to view the warnings of.")
        .setRequired(false)
    ),
  run: async ({ interaction }) => {
    const member =
      interaction.guild.members.cache.get(
        interaction.options.getUser("user")?.id
      ) || interaction.member;

    const warns = await Warns.find({
      guild: interaction.guild.id,
      user: member.id,
    });

    if (!warns.length)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${emotes.question} ${
                member.id === interaction.member.id
                  ? "You have"
                  : "That user has"
              } no warnings.`
            )
            .setColor(colors.main),
        ],
        ephemeral: true,
      });

    const warnList: APIEmbedField[] = warns.map((warn) => {
      return {
        name: warn._id.toString(),
        value: `**Moderator**: <@${warn.moderator}>\n**Reason**: ${warn.reason}`,
      };
    });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL(),
          })
          .setFields(warnList)
          .setColor(colors.main),
      ],
    });
  },
});
