import { MessageCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new MessageCommand({
  name: "addrole",
  description: "Add a role to a user.",
  minArgs: 1,
  maxArgs: 2,
  usage: "{prefix}addrole <role to add> [user]",
  examples: [
    "{prefix}addrole @Developer",
    "{prefix}addrole @Developer @Toastify",
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
    if (member.roles.cache.has(role.id))
      return message.channel.send({
        embeds: [new FailEmbed("That user already has that role.")],
      });

    member.roles.add(role);

    message.channel.send({
      embeds: [
        new SuccessEmbed(`Added **${role.name}** to **${member.user.tag}**.`),
      ],
    });
  },
});
