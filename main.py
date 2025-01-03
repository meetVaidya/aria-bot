import os
import discord
from discord.ext import commands
from dotenv import load_dotenv
from utils.auth import authenticate_user
from utils.memory import get_user_context, update_user_context
from utils.openai_integration import generate_ai_response
from utils.logger import log_message

# Load environment variables
load_dotenv()

# Initialize bot
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    # Check if the message is a DM
    if isinstance(message.channel, discord.DMChannel):
        user_id = str(message.author.id)
        
        # Authenticate user
        if not authenticate_user(user_id):
            await message.channel.send("You are not authenticated. Please subscribe to use this bot.")
            return
        
        # Retrieve user context
        chat_history, preferences = get_user_context(user_id)
        
        # Generate AI response
        response = generate_ai_response(message.content, chat_history, preferences)
        
        # Send response to user
        await message.channel.send(response)
        
        # Update chat history
        update_user_context(user_id, message.content, response)
        
        # Log the message for moderation
        log_message(user_id, message.content, response)

    await bot.process_commands(message)

# Run the bot
bot.run(os.getenv("DISCORD_TOKEN"))
