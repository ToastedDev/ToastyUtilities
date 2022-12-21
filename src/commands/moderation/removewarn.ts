import Warns from "../../schemas/Warns";
import { MessageCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new MessageCommand({
  name: "removewarn",
  aliases: ["deletewarn", "delwarn"],
  description: "Remove a warn from a user.",
  minArgs: 1,
  maxArgs: 1,
  usage: "{prefix}removewarn <warn ID>",
  examples: "{prefix}removewarn 63a2bf499f80523ffb56e075",
  permissions: ["KickMembers"],
  run: async ({ message, args }) => {
    const warnID = args[0];
    const warn = await Warns.findById(warnID);
    if (!warn || warn.guild !== message.guild.id)
      return message.channel.send({
        embeds: [new FailEmbed("Invalid warn ID.")],
      });

    const member = message.guild.members.cache.get(warn.user);

    warn.delete();

    message.channel.send({
      embeds: [
        new SuccessEmbed(
          `Removed warn \`${warnID}\`${
            member ? ` from **${member.user.tag}**` : ""
          }.`
        ),
      ],
    });
  },
});
