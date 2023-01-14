import {
  ApplicationCommandDataResolvable,
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
} from "discord.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { MessageCommandOptions, SlashCommandOptions } from "./Command";
import { guildId } from "../config";

export class BotClient extends Client {
  commands = new Collection<string, MessageCommandOptions>();
  slashCommands = new Collection<string, SlashCommandOptions>();

  constructor(
    token: string | undefined,
    options?: Omit<ClientOptions, "intents">
  ) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
      ],
      ...options,
    });

    if (!token || token.length < 10)
      throw new SyntaxError("No valid token specified.");
    this.token = token;
  }

  connect() {
    this.login();
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("Connected to MongoDB."))
      .catch(() => {
        throw new SyntaxError("No valid MongoDB URL specified.");
      });
  }

  register() {
    // Message commands
    fs.readdirSync(path.join(__dirname, "../commands")).forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(path.join(__dirname, `../commands/${dir}`))
        .filter((file) => file.endsWith("ts") || file.endsWith("js"));

      for (const file of commandFiles) {
        const command = await import(`../commands/${dir}/${file}`).then(
          (x) => x.default
        );
        if (!command?.name || !command?.run) return;

        this.commands.set(command.name, { directory: dir, ...command });
      }
    });

    // Slash commands
    const commands: ApplicationCommandDataResolvable[] = [];

    fs.readdirSync(path.join(__dirname, "../slashCommands")).forEach(
      async (dir) => {
        const commandFiles = fs
          .readdirSync(path.join(__dirname, `../slashCommands/${dir}`))
          .filter((file) => file.endsWith("ts") || file.endsWith("js"));

        for (const file of commandFiles) {
          const command = await import(`../slashCommands/${dir}/${file}`).then(
            (x) => x.default
          );
          if (!command?.data || !command?.run) return;

          this.slashCommands.set(command.data.toJSON().name, command);
          commands.push(command.data.toJSON());
        }
      }
    );

    this.on("ready", () => {
      if (guildId && guildId.length) {
        const guild = this.guilds.cache.get(guildId);
        if (!guild) return;

        guild.commands.set(commands);
        console.log(`Registered commands in ${guild.name}.`);
      } else {
        this.application?.commands.set(commands);
        console.log("Registered commands globally.");
      }
    });

    // Events
    fs.readdirSync(path.join(__dirname, "../events"))
      .filter((file) => file.endsWith("ts") || file.endsWith("js"))
      .forEach(async (file) => {
        const event = await import(`../events/${file}`).then((x) => x.default);
        if (!event?.name || !event?.run) return;

        if (event.once) this.once(event.name, event.run.bind(null, this));
        else this.on(event.name, event.run.bind(null, this));
      });
  }
}
