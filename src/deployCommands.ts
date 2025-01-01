import { REST, Routes } from "discord.js";
import type { ApplicationCommandData } from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
const CLIENT_ID = process.env.CLIENT_ID!; // Bot's application/client ID

// Slash command definition
const commands: ApplicationCommandData[] = [
  {
    name: "authenticate",
    description: "Authenticate yourself to chat with the bot.",
  },
];

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log("🚀 Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("✅ Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("❌ Error refreshing commands:", error);
  }
})();
