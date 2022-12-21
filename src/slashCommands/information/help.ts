import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { colors, emotes } from "../../config";
import { SlashCommand } from "../../structures/Command";
import fs from "fs";
import path from "path";
import { capitalize } from "../../utils/functions";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View all my commands.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to get information about.")
        .setRequired(false)
        .setAutocomplete(true)
    ),
  autocomplete: async ({ client, interaction }) => {
    const focusedValue = interaction.options.getFocused();
    const choices = client.commands
      .map((command) => command.name)
      .sort((a, b) => a.localeCompare(b));
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  run: ({ client, interaction, prefix }) => {
    const cmd = interaction.options.getString("command");
    if (cmd) {
      const command =
        client.commands.get(cmd) ||
        client.commands.find((c) => c.aliases?.includes(cmd));

      if (!command)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`${emotes.x} Invalid command.`)
              .setColor(colors.fail),
          ],
          ephemeral: true,
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

      return interaction.reply({
        embeds: [embed.setDescription(description.join("\n"))],
        ephemeral: true,
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

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setFields(categories)
            .setColor(colors.main),
        ],
        ephemeral: true,
      });
    }
  },
});
