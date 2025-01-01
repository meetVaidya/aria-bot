import { Client } from "discord.js";
import type { ClientOptions } from "discord.js";

export class ExtendedClient extends Client {
  public authenticatedUsers: Set<string> = new Set();

  constructor(options: ClientOptions) {
    super(options);
  }
}
