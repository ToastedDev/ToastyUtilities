import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { Event } from "../structures/Event";
import prefixes from "../schemas/Prefix";

export default new Event({
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      interaction.member = interaction.guild.members.cache.get(
        interaction.user.id
      );

      const { prefix } =
        (await prefixes.findOne({ guild: interaction.guild.id })) ||
        (await new prefixes({
          guild: interaction.guild.id,
        }).save());

      try {
        await command.run({
          client,
          interaction: interaction as ChatInputCommandInteraction & {
            member: GuildMember;
          },
          prefix,
        });
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.isAutocomplete()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.autocomplete({ client, interaction });
      } catch (err) {
        console.error(err);
      }
    }
  },
});
