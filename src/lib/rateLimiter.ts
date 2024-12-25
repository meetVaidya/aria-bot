import { supabase } from "./supabase";

const FREE_TIER_LIMIT = 50;

export async function rateLimit(discordId: string): Promise<string | null> {
  // Fetch user tier and message count from Supabase
  const { data, error } = await supabase
    .from("user_tiers")
    .select("tier, message_count")
    .eq("discord_id", discordId)
    .single();

  if (error) {
    console.error("Supabase Fetch Error:", error.message);
    return "Failed to fetch user data";
  }

  const { tier, message_count } = data;

  if (tier === "free" && message_count >= FREE_TIER_LIMIT) {
    return "Rate limit exceeded. Please upgrade to a paid tier to send more messages.";
  }

  return null;
}
