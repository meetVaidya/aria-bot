import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI API
openai.api_key = os.getenv("GROQ_API_KEY")


def generate_ai_response(user_message: str, chat_history: list, preferences: dict):
    """Generate a personalized AI response."""
    system_message = f"You are a {preferences.get('tone', 'casual')} assistant. The user is interested in {', '.join(preferences.get('interests', []))}."
    messages = [{"role": "system", "content": system_message}]
    messages.extend(chat_history)
    messages.append({"role": "user", "content": user_message})

    response = openai.Completion.create(model="gpt-4", messages=messages)
    return response["choices"][0]["message"]["content"]
