import { MessageCommand } from "../../structures/Command";
import Warn from "../../schemas/Warns";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new MessageCommand({
  name: "warn",
  description: "Warn a user.",
  minArgs: 1,
  usage: "{prefix}warn <user> [reason]",
  examples: "{prefix}warn @Toastify broke rule 4",
  permissions: ["KickMembers"],
  run: async ({ message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.channel.send({
        embeds: [new FailEmbed("I couldn't find that user.")],
      });
    if (member.permissions.has(["KickMembers", "Administrator"]))
      return message.channel.send({
        embeds: [new FailEmbed("That user is a mod/admin, I can't do that.")],
      });
    if (!member.manageable)
      return message.channel.send({
        embeds: [new FailEmbed("I don't have permission to warn that user.")],
      });
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send({
        embeds: [
          new FailEmbed("That user has roles that are higher/equal to yours."),
        ],
      });

    const reason = args.slice(1).join(" ");

    Warn.create({
      guild: message.guild.id,
      user: member.id,
      moderator: message.author.id,
      reason,
    });

    message.channel.send({
      embeds: [new SuccessEmbed(`**${member.user.tag}** was warned.`)],
    });
  },
});
