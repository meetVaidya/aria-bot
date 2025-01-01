import { Client, GatewayIntentBits, Partials } from "discord.js";
import { config } from "./config/environment";
import { handleCommands } from "./events/interactionCreate";
import { handleDMs } from "./events/messageCreate";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel], // Allow DMs
});

// Event Handlers
client.on("interactionCreate", handleCommands);
client.on("messageCreate", handleDMs);

client.once("ready", () => {
  console.log(`🚀 Logged in as ${client.user?.tag}!`);
});
