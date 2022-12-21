import { GuildMember } from "discord.js";
import ms from "ms";
import { MessageCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new MessageCommand({
  name: "mute",
  description: "Mute a user.",
  minArgs: 2,
  usage: "{prefix}mute <user> <time> [reason]",
  examples: "{prefix}mute @Toastify 1m breaking the rules",
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
        embeds: [new FailEmbed("I don't have permission to mute that user.")],
      });
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send({
        embeds: [
          new FailEmbed("That user has roles that are higher/equal to yours."),
        ],
      });
    if (member.isCommunicationDisabled())
      return message.channel.send({
        embeds: [new FailEmbed("That user is already muted.")],
      });

    const time = ms(args[1]);
    if (!time)
      return message.channel.send({
        embeds: [new FailEmbed("Please specify a valid time.")],
      });

    const reason = args.splice(2).join(" ") || "No reason specified.";

    (member as GuildMember).timeout(time, reason);

    message.channel.send({
      embeds: [
        new SuccessEmbed(`**${(member as GuildMember).user.tag}** was muted.`),
      ],
    });
  },
});
