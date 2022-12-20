import {
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
} from "discord.js";
import mongoose from "mongoose";
import fs from "fs";
import { MessageCommand, SlashCommand } from "./Command";

export class BotClient extends Client {
  commands = new Collection<string, MessageCommand>();
  // slashCommands = new Collection<string, SlashCommand>();

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
    fs.readdirSync("./src/commands").forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(`./src/commands/${dir}`)
        .filter((file) => file.endsWith("ts") || file.endsWith("js"));

      for (const file of commandFiles) {
        const command = await import(`../commands/${dir}/${file}`).then(
          (x) => x.default
        );
        if (!command?.name || !command?.run) return;

        this.commands.set(command.name, { directory: dir, ...command });
      }
    });

    // Events
    fs.readdirSync("./src/events/")
      .filter((file) => file.endsWith("ts") || file.endsWith("js"))
      .forEach(async (file) => {
        const event = await import(`../events/${file}`).then((x) => x.default);
        if (!event?.name || !event?.run) return;

        if (event.once) this.once(event.name, event.run.bind(null, this));
        else this.on(event.name, event.run.bind(null, this));
      });
  }
}
