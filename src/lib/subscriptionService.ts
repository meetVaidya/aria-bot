import { createClient } from "@supabase/supabase-js";
import { config } from "../config/environment";

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_API_KEY);

export interface SubscriptionTier {
  name: string;
  messageLimit: number;
  priceUsd: number;
  features: string[];
}

export class SubscriptionService {
  // Get user's current subscription
  async getUserSubscription(discordId: string) {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*, subscription_tiers(*)")
      .eq("discord_id", discordId)
      .single();

    if (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }

    return data;
  }

  // Activate a subscription (for development/testing)
  async activateDevSubscription(
    discordId: string,
    tierName: string,
    durationDays: number = 30,
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const { error } = await supabase.from("user_subscriptions").upsert({
      discord_id: discordId,
      tier: tierName,
      subscription_status: "active",
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      console.error("Error activating subscription:", error);
      return false;
    }

    return true;
  }

  // Check if subscription is active
  async isSubscriptionActive(discordId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("subscription_status, expires_at")
      .eq("discord_id", discordId)
      .single();

    if (error || !data) {
      return false;
    }

    return (
      data.subscription_status === "active" &&
      new Date(data.expires_at) > new Date()
    );
  }

  // Get available subscription tiers
  async getAvailableTiers(): Promise<SubscriptionTier[]> {
    const { data, error } = await supabase
      .from("subscription_tiers")
      .select("*");

    if (error) {
      console.error("Error fetching tiers:", error);
      return [];
    }

    return data;
  }
}
