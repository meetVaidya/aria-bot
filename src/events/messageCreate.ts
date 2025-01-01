import { DMChannel } from "discord.js";
import {
  logDMMessage,
  updateBotResponse,
  isUserAuthenticated,
} from "../lib/supabase";
import { rateLimit } from "../lib/rateLimiter";
import { openai } from "../lib/openai";
import { botPrompt } from "../config/botPrompt";

const authenticatedUsers = new Set<string>();

export const handleDMs = async (message: any) => {
  if (message.author.bot) return;

  if (message.channel instanceof DMChannel) {
    const user = message.author;

    console.log(`Received DM from ${user.tag}: ${message.content}`);

    if (!authenticatedUsers.has(user.id)) {
      const isAuthenticated = await isUserAuthenticated(user.id);
      if (!isAuthenticated) {
        await user.send(
          "❌ You are not authenticated! Use `/authenticate` in a server channel first.",
        );
        return;
      }
      authenticatedUsers.add(user.id);
    }

    const rateLimitMessage = await rateLimit(user.id);
    if (rateLimitMessage) {
      await user.send(rateLimitMessage);
      return;
    }

    const messageId = await logDMMessage(user.tag, message.content);

    if (!messageId) {
      await user.send("❌ Sorry, something went wrong. Please try again.");
      return;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "grok-2-1212",
        messages: [
          {
            role: "system",
            content: botPrompt,
          },
          { role: "user", content: message.content },
        ],
      });

      const reply =
        response.choices[0]?.message?.content || "I have no response.";

      await updateBotResponse(messageId, reply);

      await user.send(reply);

      console.log(`Sent DM to ${user.tag}: ${reply}`);
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      await user.send("❌ Sorry, something went wrong. Please try again.");
    }
  }
};
