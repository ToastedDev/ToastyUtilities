import { MessageCommand } from "../../structures/Command";
import ms from "ms";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";
import { GuildTextBasedChannel } from "discord.js";

export default new MessageCommand({
  name: "slowmode",
  aliases: ["sm"],
  description: "Update the slowmode in a channel.",
  minArgs: 1,
  maxArgs: 2,
  usage: ["{prefix}slowmode <time>", "{prefix}slowmode <time> [channel]"],
  examples: ["{prefix}slowmode 5s", "{prefix}slowmode 5s #general"],
  run: async ({ message, args }) => {
    const time = ms(args[0]);
    if (time > ms("6h"))
      return message.channel.send({
        embeds: [new FailEmbed("Slowmode must be below **6 hours**.")],
      });

    const channel = (message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[1]) ||
      message.channel) as GuildTextBasedChannel;
    if (!channel.isTextBased())
      return message.channel.send({
        embeds: [new FailEmbed("Channel must be a text channel.")],
      });

    channel.setRateLimitPerUser(time / 1000);

    message.channel.send({
      embeds: [
        new SuccessEmbed(
          `Slowmode${
            channel.id !== message.channel.id ? ` in ${channel}` : ""
          } was ${
            time === 0
              ? "**disabled**"
              : `set to **${ms(time, { long: true })}**`
          }.`
        ),
      ],
    });
  },
});
