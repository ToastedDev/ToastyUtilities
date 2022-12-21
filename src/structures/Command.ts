import { Command as ToastyMessageCommand } from "@toastify/structures/MessageCommand";
import { Command as ToastySlashCommand } from "@toastify/structures/SlashCommand";
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "./BotClient";

type MessageCommandOptions = {
  name: string;
  description?: string;
  minArgs?: number;
  maxArgs?: number;
  usage?: string | string[];
  examples?: string | string[];
  aliases?: string[];
  permissions?: PermissionResolvable[];
  directory?: string;
  run: (params: {
    client: BotClient;
    message: Message;
    args: string[];
    prefix: string;
  }) => any;
};

type SlashCommandOptions = {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  autocomplete?: (params: {
    client: BotClient;
    interaction: AutocompleteInteraction;
  }) => any;
  run: (params: {
    client: BotClient;
    interaction: ChatInputCommandInteraction & { member: GuildMember };
    prefix: string;
  }) => any;
};

export class MessageCommand extends ToastyMessageCommand {
  declare usage?: string | string[];
  declare examples: string | string[];
  declare run: (params: {
    client: BotClient;
    message: Message;
    args: string[];
    prefix: string;
  }) => any;
  constructor(options: MessageCommandOptions) {
    super(options);
  }
}

export class SlashCommand extends ToastySlashCommand {
  declare autocomplete?: (params: {
    client: BotClient;
    interaction: AutocompleteInteraction;
  }) => any;
  declare run: (params: {
    client: BotClient;
    interaction: ChatInputCommandInteraction & { member: GuildMember };
    prefix: string;
  }) => any;
  constructor(options: SlashCommandOptions) {
    super(options);
  }
}
