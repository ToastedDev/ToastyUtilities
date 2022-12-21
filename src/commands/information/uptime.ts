import { MessageCommand } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";
import { colors } from "../../config";

function formatUptime(uptime: number): string {
  let totalSeconds = uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  let formatted: string[] = [];
  if (days > 0) formatted.push(`${days} days`);
  if (hours > 0) formatted.push(`${hours} hrs`);
  if (minutes > 0) formatted.push(`${minutes} mins`);
  if (seconds > 0) formatted.push(`${seconds} secs`);
  return formatted.join(", ");
}

export default new MessageCommand({
  name: "uptime",
  description: "View how long I have been online for.",
  run: ({ client, message }) => {
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTitle("Uptime")
          .setDescription(formatUptime(client.uptime))
          .setColor(colors.main),
      ],
    });
  },
});
