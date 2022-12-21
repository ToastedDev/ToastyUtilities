import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Warns from "../../schemas/Warns";
import { SlashCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Remove a warn from a user.")
    .addStringOption((option) =>
      option.setName("id").setDescription("The warn's ID.").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  run: async ({ interaction }) => {
    const warnID = interaction.options.getString("id");
    const warn = await Warns.findById(warnID);
    if (!warn || warn.guild !== interaction.guild.id)
      return interaction.reply({
        embeds: [new FailEmbed("Invalid warn ID.")],
        ephemeral: true,
      });

    const member = interaction.guild.members.cache.get(warn.user);

    warn.delete();

    interaction.reply({
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
