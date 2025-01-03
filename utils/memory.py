from supabase import create_client, Client
import os

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def get_user_context(user_id: str):
    """Retrieve user chat history and preferences."""
    user = supabase.table("users").select("*").eq("user_id", user_id).execute()
    if user.data:
        return user.data[0].get("chat_history", []), user.data[0].get("preferences", {})
    return [], {}

def update_user_context(user_id: str, user_message: str, bot_response: str):
    """Update user chat history."""
    chat_history, preferences = get_user_context(user_id)
    chat_history.extend([
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": bot_response}
    ])
    supabase.table("users").update({
        "chat_history": chat_history
    }).eq("user_id", user_id).execute()
