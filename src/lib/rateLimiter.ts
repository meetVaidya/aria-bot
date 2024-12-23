import { createClient } from "@supabase/supabase-js";
import { SubscriptionService } from "./subscriptionService";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
const subscriptionService = new SubscriptionService();

const TIER_LIMITS = {
  free: 50,
  basic: 500,
  premium: 2000,
  unlimited: Infinity,
};

export async function rateLimit(discordId: string): Promise<string | null> {
  const subscription = await subscriptionService.getUserSubscription(discordId);

  if (!subscription) {
    return "Subscription not found";
  }

  // Check if subscription is active for paid tiers
  if (subscription.tier !== "free") {
    const isActive = await subscriptionService.isSubscriptionActive(discordId);
    if (!isActive) {
      // Downgrade to free tier
      await subscriptionService.activateDevSubscription(discordId, "free");
      return "Your subscription has expired. You have been downgraded to the free tier.";
    }
  }

  const messageLimit =
    TIER_LIMITS[subscription.tier as keyof typeof TIER_LIMITS] ||
    TIER_LIMITS.free;

  // Get current message count
  const { count: messageCount } = await supabase
    .from("dm_messages")
    .select("*", { count: "exact" })
    .eq("discord_id", discordId)
    .gte(
      "created_at",
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    );

  if ((messageCount || 0) >= messageLimit) {
    return `Rate limit exceeded. Your current tier (${subscription.tier}) allows ${messageLimit} messages per month.`;
  }

  return null;
}
