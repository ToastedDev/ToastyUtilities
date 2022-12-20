import { Event } from "../structures/Event";
import { EmbedBuilder } from "discord.js";
import { colors, emotes } from "../config";
import prefixes from "../schemas/Prefix";

function escapeRegex(str: string) {
  return str?.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}

export default new Event({
  name: "messageCreate",
  run: async (client, message) => {
    if (!message.guild || message.author.bot) return;

    const { prefix } =
      (await prefixes.findOne({ guild: message.guild.id })) ||
      (await new prefixes({
        guild: message.guild.id,
      }).save());

    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;

    const [, mPrefix] = message.content.match(prefixRegex);

    const [cmd, ...args] = message.content
      .slice(mPrefix.length)
      .trim()
      .split(/ +/);

    if (cmd.length === 0 && mPrefix.includes(client.user.id))
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${emotes.question} My prefix in this server is \`${prefix}\`.`
            )
            .setColor(colors.main),
        ],
      });

    const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;

    try {
      if (command.minArgs && args.length < command.minArgs)
        return client.commands
          .get("help")
          .run({ client, message, args: [command.name], prefix });
      if (command.maxArgs && args.length > command.maxArgs)
        return client.commands
          .get("help")
          .run({ client, message, args: [command.name], prefix });

      if (
        command.permissions &&
        !message.member.permissions.has(command.permissions)
      )
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${emotes.x} You don't have permission to run this command.`
              )
              .setColor(colors.fail),
          ],
        });

      await command.run({ client, message, args, prefix });
    } catch (err) {
      console.error(err);
    }
  },
});
