import sys
import json
import asyncio
from ai_text_generator import AITextGenerator

async def main():
    try:
        # Get context from command line argument
        context_str = sys.argv[1] if len(sys.argv) > 1 else "{}"
        context = json.loads(context_str)
        
        # Remove null values
        context = {k: v for k, v in context.items() if v is not None}
        
        # Generate greeting
        generator = AITextGenerator()
        greeting = await generator.generate_greeting(context if context else None)
        
        # Output JSON
        result = {
            "greeting": greeting
        }
        print(json.dumps(result))
        
    except Exception as e:
        # Fallback greeting
        result = {
            "greeting": "Hey Player, ready to dominate the court today?"
        }
        print(json.dumps(result))
        sys.stderr.write(f"Error: {str(e)}\n")

if __name__ == "__main__":
    asyncio.run(main())
