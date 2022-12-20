import { EmbedBuilder, resolveColor } from "discord.js";
import { colors, emotes } from "../config";

export class SuccessEmbed extends EmbedBuilder {
  constructor(description: string) {
    super({
      color: resolveColor(colors.success),
      description: `${emotes.check} ${description}`,
    });
  }
}

export class FailEmbed extends EmbedBuilder {
  constructor(description: string) {
    super({
      color: resolveColor(colors.fail),
      description: `${emotes.x} ${description}`,
    });
  }
}
