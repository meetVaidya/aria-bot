import { createClient } from "@supabase/supabase-js";
import { config } from "../config/environment";

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_API_KEY);

export async function isUserAuthenticated(discordId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("authenticated_users")
    .select("discord_id")
    .eq("discord_id", discordId)
    .single();

  return !!data && !error;
}

export async function signInWithDiscord(
  discordId: string,
): Promise<string | null> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${config.SUPABASE_REDIRECT_URL}/oauth-callback?discordId=${discordId}`,
    },
  });

  if (error) {
    console.error("Supabase OAuth Error:", error.message);
    return null;
  }

  return data.url;
}

export async function logDMMessage(
  discordId: string,
  messageContent: string,
  botResponse?: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("dm_messages")
    .insert([
      {
        discord_id: discordId,
        message_content: messageContent,
        bot_response: botResponse,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error.message);
    return null;
  }

  return data.id;
}

export async function updateBotResponse(
  messageId: string,
  botResponse: string,
): Promise<void> {
  const { error } = await supabase
    .from("dm_messages")
    .update({ bot_response: botResponse })
    .eq("id", messageId);

  if (error) {
    console.error("Supabase Update Error:", error.message);
  }
}
