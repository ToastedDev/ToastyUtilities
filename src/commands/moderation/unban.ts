import { MessageCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new MessageCommand({
  name: "unban",
  description: "Unban a user.",
  minArgs: 1,
  usage: "{prefix}unban <user ID> [reason]",
  examples: "{prefix}unban 955408387905048637 good toaster",
  permissions: ["BanMembers"],
  run: async ({ message, args }) => {
    const userID = args[0];

    const ban =
      message.guild.bans.cache.get(userID) ||
      (await message.guild.bans.fetch(userID));
    if (!ban)
      return message.channel.send({
        embeds: [new FailEmbed("That user isn't banned in this server.")],
      });

    const reason = args.slice(1).join(" ") || "No reason specified.";

    message.guild.members.unban(userID, reason).then((user) => {
      message.channel.send({
        embeds: [new SuccessEmbed(`**${user.tag}** was unbanned.`)],
      });
    });
  },
});
