import { MessageCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new MessageCommand({
  name: "removerole",
  description: "Remove a role from a user.",
  minArgs: 1,
  maxArgs: 2,
  usage: "{prefix}addrole <role to remove> [user]",
  examples: [
    "{prefix}removerole @Developer",
    "{prefix}removerole @Developer @Toastify",
  ],
  permissions: ["ManageRoles"],
  run: async ({ message, args }) => {
    const role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    if (!role)
      return message.channel.send({
        embeds: [new FailEmbed("I couldn't find that role.")],
      });
    if (role.position >= message.guild.members.me.roles.highest.position)
      return message.channel.send({
        embeds: [new FailEmbed("I don't have permission to add that role.")],
      });

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    if (
      member.id !== message.member.id &&
      member.roles.highest.position >= message.member.roles.highest.position
    )
      return message.channel.send({
        embeds: [
          new FailEmbed("That user has roles that are higher/equal to yours."),
        ],
      });
    if (!member.roles.cache.has(role.id))
      return message.channel.send({
        embeds: [new FailEmbed("That user does not have that role.")],
      });

    member.roles.remove(role);

    message.channel.send({
      embeds: [
        new SuccessEmbed(
          `Removed **${role.name}** from **${member.user.tag}**.`
        ),
      ],
    });
  },
});
