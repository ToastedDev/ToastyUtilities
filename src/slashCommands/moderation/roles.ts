import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Manage roles.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a role to a user.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add.")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add the role to.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a role from a user.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove.")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove the role from.")
            .setRequired(false)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  run: ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "add":
        {
          const role = interaction.guild.roles.cache.get(
            interaction.options.getRole("role").id
          );
          if (!role)
            return interaction.reply({
              embeds: [new FailEmbed("I couldn't find that role.")],
              ephemeral: true,
            });
          if (
            role.position >= interaction.guild.members.me.roles.highest.position
          )
            return interaction.reply({
              embeds: [
                new FailEmbed("I don't have permission to add that role."),
              ],
              ephemeral: true,
            });

          const member =
            interaction.guild.members.cache.get(
              interaction.options.getUser("user")?.id
            ) || interaction.member;
          if (
            member.id !== interaction.member.id &&
            member.roles.highest.position >=
              interaction.member.roles.highest.position
          )
            return interaction.reply({
              embeds: [
                new FailEmbed(
                  "That user has roles that are higher/equal to yours."
                ),
              ],
            });
          if (member.roles.cache.has(role.id))
            return interaction.reply({
              embeds: [new FailEmbed("That user already has that role.")],
              ephemeral: true,
            });

          member.roles.add(role);

          interaction.reply({
            embeds: [
              new SuccessEmbed(
                `Added **${role.name}** to **${member.user.tag}**.`
              ),
            ],
          });
        }
        break;
      case "remove":
        {
          const role = interaction.guild.roles.cache.get(
            interaction.options.getRole("role").id
          );
          if (!role)
            return interaction.reply({
              embeds: [new FailEmbed("I couldn't find that role.")],
              ephemeral: true,
            });
          if (
            role.position >= interaction.guild.members.me.roles.highest.position
          )
            return interaction.reply({
              embeds: [
                new FailEmbed("I don't have permission to add that role."),
              ],
              ephemeral: true,
            });

          const member =
            interaction.guild.members.cache.get(
              interaction.options.getUser("user")?.id
            ) || interaction.member;
          if (
            member.id !== interaction.member.id &&
            member.roles.highest.position >=
              interaction.member.roles.highest.position
          )
            return interaction.reply({
              embeds: [
                new FailEmbed(
                  "That user has roles that are higher/equal to yours."
                ),
              ],
              ephemeral: true,
            });
          if (!member.roles.cache.has(role.id))
            return interaction.reply({
              embeds: [new FailEmbed("That user does not have that role.")],
              ephemeral: true,
            });

          member.roles.remove(role);

          interaction.reply({
            embeds: [
              new SuccessEmbed(
                `Removed **${role.name}** from **${member.user.tag}**.`
              ),
            ],
          });
        }
        break;
    }
  },
});
