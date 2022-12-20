import { EmbedBuilder } from "discord.js";
import { colors, emotes } from "../../config";
import { MessageCommand } from "../../structures/Command";

export default new MessageCommand({
  name: "help",
  description: "View all my commands.",
  maxArgs: 1,
  usage: ["{prefix}help", "{prefix}help [command]"],
  examples: ["{prefix}help", "{prefix}help ban"],
  run: ({ client, message, args, prefix }) => {
    const cmd = args[0]?.toLowerCase();
    if (cmd) {
      const command =
        client.commands.get(cmd) ||
        client.commands.find((c) => c.aliases?.includes(cmd));

      if (!command)
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(`${emotes.x} Invalid command.`)
              .setColor(colors.fail),
          ],
        });

      let description: string[] = [];
      const embed = new EmbedBuilder()
        .setTitle(`**Command: ${prefix}${command.name}**`)
        .setColor(colors.main);

      if (command.description)
        description.push(`**Description**: ${command.description}`);

      if (command.usage) {
        if (typeof command.usage === "string")
          description.push(
            `**Usage**: ${command.usage.replace(/\{prefix\}/g, prefix)}`
          );
        else
          description.push(
            `**Usage**:\n${command.usage
              .join("\n")
              .replace(/\{prefix\}/g, prefix)}`
          );
      } else description.push(`**Usage**: ${prefix}${command.name}`);

      if (command.examples) {
        if (typeof command.examples === "string")
          description.push(
            `**Example**: ${command.examples.replace(/\{prefix\}/g, prefix)}`
          );
        else
          description.push(
            `**Examples**:\n${command.examples
              .join("\n")
              .replace(/\{prefix\}/g, prefix)}`
          );
      }

      return message.channel.send({
        embeds: [embed.setDescription(description.join("\n"))],
      });
    }
  },
});
