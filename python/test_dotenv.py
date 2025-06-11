import os
import dotenv

# Load environment variables from .env file
dotenv.load_dotenv()

print("GEMINI_API_KEY:", os.environ.get("GEMINI_API_KEY"))
print("SECRET_KEY:", os.environ.get("SECRET_KEY"))