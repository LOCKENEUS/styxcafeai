import sys
import json
import asyncio
from ai_text_generator import AITextGenerator

async def main():
    try:
        # Get sport name from command line argument
        sport_name = sys.argv[1] if len(sys.argv) > 1 else "sport"
        
        # Generate sport description
        generator = AITextGenerator()
        description = await generator.generate_sport_description(sport_name)
        
        # Output JSON
        result = {
            "description": description
        }
        print(json.dumps(result))
        
    except Exception as e:
        # Fallback description
        sport = sys.argv[1] if len(sys.argv) > 1 else "this sport"
        result = {
            "description": f"Experience the thrill of {sport}! Book your slot now."
        }
        print(json.dumps(result))
        sys.stderr.write(f"Error: {str(e)}\n")

if __name__ == "__main__":
    asyncio.run(main())
