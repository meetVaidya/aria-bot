from supabase import create_client, Client
import os

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

class User:
    def __init__(self, user_id: str, subscription_status: str, chat_history: list, preferences: dict):
        self.user_id = user_id
        self.subscription_status = subscription_status
        self.chat_history = chat_history
        self.preferences = preferences

    def save(self):
        """Save user data to Supabase."""
        supabase.table("users").upsert({
            "user_id": self.user_id,
            "subscription_status": self.subscription_status,
            "chat_history": self.chat_history,
            "preferences": self.preferences
        }).execute()
