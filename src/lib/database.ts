import { createClient } from "@supabase/supabase-js";
import { env } from "../config/environment";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY);

export async function isUserAuthenticated(discordId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("authenticated_users")
    .select("discord_id")
    .eq("discord_id", discordId)
    .single();

  return !!data && !error;
}

export async function authenticateUser(discordId: string): Promise<boolean> {
  const { error } = await supabase
    .from("authenticated_users")
    .insert([{ discord_id: discordId }]);

  return !error;
}

export async function logDMMessage(
  discordId: string,
  messageContent: string,
  botResponse?: string,
): Promise<string | null> {
  // ... existing logDMMessage implementation
}

export async function updateBotResponse(
  messageId: string,
  botResponse: string,
): Promise<void> {
  // ... existing updateBotResponse implementation
}
