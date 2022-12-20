import { MessageCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new MessageCommand({
  name: "kick",
  description: "Kick a user.",
  minArgs: 1,
  usage: "{prefix}kick <user> [reason]",
  examples: "{prefix}kick @Toastify bad toaster",
  run: async ({ message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      (await message.guild.members.fetch(args[0]));
    if (!member)
      return message.channel.send({
        embeds: [new FailEmbed("I couldn't find that user.")],
      });
    if (member.permissions.has(["KickMembers", "Administrator"]))
      return message.channel.send({
        embeds: [new FailEmbed("That user is a mod/admin, I can't do that.")],
      });
    if (!member.kickable)
      return message.channel.send({
        embeds: [new FailEmbed("I don't have permission to kick that user.")],
      });
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send({
        embeds: [
          new FailEmbed("That user has roles that are higher/equal to yours."),
        ],
      });

    const reason = args.slice(1).join(" ") || "No reason specified.";

    member.kick(reason);

    message.channel.send({
      embeds: [new SuccessEmbed(`**${member.user.tag}** was kicked.`)],
    });
  },
});
