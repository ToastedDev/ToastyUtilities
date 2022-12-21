import { SlashCommand } from "../../structures/Command";
import ms from "ms";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";
import {
  ChannelType,
  GuildTextBasedChannel,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Update the slowmode in a channel.")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The amount of slowmode.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to set the slowmode of.")
        .addChannelTypes(
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.PrivateThread,
          ChannelType.AnnouncementThread,
          ChannelType.GuildText,
          ChannelType.GuildForum,
          ChannelType.GuildVoice
        )
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  run: async ({ interaction }) => {
    const time = ms(interaction.options.getString("time"));
    if (time > ms("6h"))
      return interaction.reply({
        embeds: [new FailEmbed("Slowmode must be below **6 hours**.")],
        ephemeral: true,
      });

    const channel = (interaction.options.getChannel("channel") ||
      interaction.channel) as GuildTextBasedChannel;
    if (!channel.isTextBased())
      return interaction.reply({
        embeds: [new FailEmbed("Channel must be a text channel.")],
      });

    channel.setRateLimitPerUser(time / 1000);

    interaction.reply({
      embeds: [
        new SuccessEmbed(
          `Slowmode${
            channel.id !== interaction.channel.id ? ` in ${channel}` : ""
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
