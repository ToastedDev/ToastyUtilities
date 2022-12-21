import { APIEmbedField, EmbedBuilder } from "discord.js";
import { colors, emotes } from "../../config";
import { MessageCommand } from "../../structures/Command";
import fs from "fs";
import path from "path";
import { capitalize } from "../../utils/functions";

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

      if (command.aliases)
        description.push(
          `**Aliases**: ${command.aliases
            .map((alias) => `${prefix}${alias}`)
            .join(", ")}`
        );

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
    } else {
      const categories: APIEmbedField[] = [];

      fs.readdirSync(path.join(__dirname, "../../commands")).forEach((dir) => {
        const commands = fs
          .readdirSync(path.join(__dirname, `../../commands/${dir}`))
          .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

        const cmds = commands
          .map((command) => {
            let file = require(`../../commands/${dir}/${command}`)?.default;
            if (!file?.name) return;

            return `\`${file.name}\``;
          })
          .sort((a, b) => a.localeCompare(b));

        if (!cmds) return;

        categories.push({
          name: `${capitalize(dir)} [${cmds.length}]`,
          value: cmds.join(", "),
        });
      });

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setFields(categories)
            .setColor(colors.main),
        ],
      });
    }
  },
});
