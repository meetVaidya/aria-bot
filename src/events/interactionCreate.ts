import { Interaction } from "discord.js";
import { isUserAuthenticated, signInWithDiscord } from "../lib/supabase";

export const handleCommands = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;

  if (commandName === "authenticate") {
    const isAuthenticated = await isUserAuthenticated(user.id);

    if (isAuthenticated) {
      await interaction.reply({
        content:
          "✅ You are already authenticated! You can chat with me in DMs.",
        ephemeral: true,
      });
      return;
    }

    const authUrl = await signInWithDiscord(user.id);

    if (authUrl) {
      await interaction.reply({
        content: `🔗 Please authenticate by clicking [here](${authUrl}).`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "❌ Failed to authenticate. Please try again later.",
        ephemeral: true,
      });
    }
  }
};
