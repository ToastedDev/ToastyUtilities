import { MessageCommand } from "../../structures/Command";
import prefixes from "../../schemas/Prefix";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new MessageCommand({
  name: "prefix",
  description: "Change the prefix for this server.",
  minArgs: 1,
  usage: "{prefix}prefix <new prefix>",
  examples: "{prefix}prefix -",
  run: async ({ message, args }) => {
    const newPrefix = args[0];
    if (newPrefix.length > 5)
      return message.channel.send({
        embeds: [new FailEmbed("Prefix must be less than **5 characters**.")],
      });

    await prefixes.findOneAndUpdate(
      { guild: message.guild.id },
      { $set: { prefix: newPrefix } }
    );

    message.channel.send({
      embeds: [new SuccessEmbed(`Updated server prefix to \`${newPrefix}\`.`)],
    });
  },
});
