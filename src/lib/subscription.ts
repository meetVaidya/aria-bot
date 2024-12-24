import { SlashCommandBuilder } from "@discordjs/builders";
import { SubscriptionService } from "../lib/subscriptionService";

const subscriptionService = new SubscriptionService();

export const data = new SlashCommandBuilder()
  .setName("subscription")
  .setDescription("Manage your subscription")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("status")
      .setDescription("Check your current subscription status"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("activate")
      .setDescription("[DEV] Activate a subscription tier")
      .addStringOption((option) =>
        option
          .setName("tier")
          .setDescription("Subscription tier")
          .setRequired(true)
          .addChoices(
            { name: "Basic", value: "basic" },
            { name: "Premium", value: "premium" },
            { name: "Unlimited", value: "unlimited" },
          ),
      ),
  );

export async function execute(interaction: {
  options: { getSubcommand: () => any; getString: (arg0: string) => any };
  user: { id: string };
  reply: (arg0: string) => any;
}) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === "status") {
    const subscription = await subscriptionService.getUserSubscription(
      interaction.user.id,
    );

    if (!subscription) {
      return interaction.reply("You don't have an active subscription.");
    }

    return interaction.reply(
      `Your current subscription:\nTier: ${subscription.tier}\nStatus: ${subscription.subscription_status}\nExpires: ${new Date(subscription.expires_at).toLocaleDateString()}`,
    );
  }

  if (subcommand === "activate" && process.env.NODE_ENV === "development") {
    const tier = interaction.options.getString("tier");
    const success = await subscriptionService.activateDevSubscription(
      interaction.user.id,
      tier,
    );

    if (success) {
      return interaction.reply(
        `Successfully activated ${tier} subscription for testing.`,
      );
    } else {
      return interaction.reply("Failed to activate subscription.");
    }
  }
}
