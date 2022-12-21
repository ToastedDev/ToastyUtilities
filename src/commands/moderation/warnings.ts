import { APIEmbedField, EmbedBuilder } from "discord.js";
import { colors, emotes } from "../../config";
import Warns from "../../schemas/Warns";
import { MessageCommand } from "../../structures/Command";

export default new MessageCommand({
  name: "warnings",
  aliases: ["warns"],
  description: "View a user's warnings.",
  usage: "{prefix}warnings [user]",
  examples: ["{prefix}warnings", "{prefix}warnings @Toastify"],
  run: async ({ message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const warns = await Warns.find({
      guild: message.guild.id,
      user: member.id,
    });

    if (!warns.length)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${emotes.question} ${
                member.id === message.member.id ? "You have" : "That user has"
              } no warnings.`
            )
            .setColor(colors.main),
        ],
      });

    const warnList: APIEmbedField[] = warns.map((warn) => {
      return {
        name: warn._id.toString(),
        value: `**Moderator**: <@${warn.moderator}>\n**Reason**: ${warn.reason}`,
      };
    });

    message.channel.send({
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
