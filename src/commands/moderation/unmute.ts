import { MessageCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new MessageCommand({
  name: "unmute",
  description: "Unmute a user.",
  minArgs: 1,
  usage: "{prefix}unmute <user> [reason]",
  examples: "{prefix}unmute @Toastify breaking the rules",
  permissions: ["ModerateMembers"],
  run: async ({ message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.channel.send({
        embeds: [new FailEmbed("I couldn't find that user.")],
      });
    if (member.permissions.has(["ModerateMembers", "Administrator"]))
      return message.channel.send({
        embeds: [new FailEmbed("That user is a mod/admin, I can't do that.")],
      });
    if (!member.moderatable)
      return message.channel.send({
        embeds: [new FailEmbed("I don't have permission to unmute that user.")],
      });
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send({
        embeds: [
          new FailEmbed("That user has roles that are higher/equal to yours."),
        ],
      });
    if (!member.isCommunicationDisabled())
      return message.channel.send({
        embeds: [new FailEmbed("That user is not muted.")],
      });

    const reason = args.splice(1).join(" ") || "No reason specified.";

    member.timeout(null, reason);

    message.channel.send({
      embeds: [new SuccessEmbed(`**${member.user.tag}** was unmuted.`)],
    });
  },
});
