from supabase import create_client, Client
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL and Key must be provided")

supabase: Client = create_client(supabase_url, supabase_key)


def log_message(user_id: str, user_message: str, bot_response: str):
    """Log messages for moderation purposes."""
    supabase.table("message_logs").insert(
        {
            "user_id": user_id,
            "user_message": user_message,
            "bot_response": bot_response,
            "timestamp": datetime.utcnow().isoformat(),
        }
    ).execute()
