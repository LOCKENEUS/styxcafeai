import os
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage
import asyncio

load_dotenv()

class AITextGenerator:
    def __init__(self):
        self.api_key = os.getenv('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment variables")
    
    async def generate_greeting(self, user_context=None):
        """
        Generate a dynamic, contextual greeting for the Sporty app.
        
        Args:
            user_context: Optional dictionary with user info (name, preferred_sport, time_of_day)
        
        Returns:
            str: Generated greeting message
        """
        try:
            # Create context-aware system message
            system_message = """You are an enthusiastic sports assistant for Sporty, a sports booking platform. 
Your task is to generate short, energetic greetings (max 20 words) that inspire users to book sports activities.
Be playful, motivating, and use sports terminology naturally."""

            # Build user message based on context
            if user_context:
                name = user_context.get('name', 'Player')
                sport = user_context.get('preferred_sport', '')
                time = user_context.get('time_of_day', '')
                
                context_str = f"User: {name}."
                if sport:
                    context_str += f" Preferred sport: {sport}."
                if time:
                    context_str += f" Time: {time}."
                
                prompt = f"{context_str} Generate a short, energetic greeting."
            else:
                prompt = "Generate a short, energetic greeting for a sports enthusiast visiting the app."
            
            # Initialize chat with Claude Sonnet 4
            chat = LlmChat(
                api_key=self.api_key,
                session_id="sporty-greeting",
                system_message=system_message
            ).with_model("anthropic", "claude-3-7-sonnet-20250219")
            
            # Create user message
            user_message = UserMessage(text=prompt)
            
            # Get response
            response = await chat.send_message(user_message)
            
            return response.strip()
        
        except Exception as e:
            print(f"Error generating greeting: {e}")
            # Fallback greeting
            return "Hey Player, ready to dominate the court today?"
    
    async def generate_sport_description(self, sport_name):
        """
        Generate an exciting description for a sport.
        
        Args:
            sport_name: Name of the sport
        
        Returns:
            str: Generated sport description
        """
        try:
            system_message = """You are a sports marketing expert. Generate exciting, short descriptions (max 30 words) 
for sports that make people want to play them. Be energetic and highlight the fun aspects."""
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id="sporty-description",
                system_message=system_message
            ).with_model("anthropic", "claude-3-7-sonnet-20250219")
            
            user_message = UserMessage(
                text=f"Generate an exciting description for {sport_name}."
            )
            
            response = await chat.send_message(user_message)
            return response.strip()
        
        except Exception as e:
            print(f"Error generating sport description: {e}")
            return f"Experience the thrill of {sport_name}! Book your slot now."

# Test function
async def test_ai_generator():
    generator = AITextGenerator()
    
    # Test greeting without context
    greeting1 = await generator.generate_greeting()
    print(f"Greeting 1: {greeting1}")
    
    # Test greeting with context
    context = {
        'name': 'Alex',
        'preferred_sport': 'Basketball',
        'time_of_day': 'evening'
    }
    greeting2 = await generator.generate_greeting(context)
    print(f"Greeting 2: {greeting2}")
    
    # Test sport description
    description = await generator.generate_sport_description("Football")
    print(f"Sport description: {description}")

if __name__ == "__main__":
    asyncio.run(test_ai_generator())
