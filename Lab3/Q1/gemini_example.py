"""
gemini_example.py — complementary Python example
Shows how to call the Gemini API and get a JSON response,
as referenced in the assignment brief.

Install: pip install google-generativeai python-dotenv
Run:     python gemini_example.py
"""

import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-2.0-flash")

prompt = "What is the capital of France? Reply in JSON with key 'answer'."
response = model.generate_content(prompt)

# The response text — parse as JSON if the model returns JSON
print(response.text)
try:
    data = json.loads(response.text.strip("` \njson"))
    print("Parsed answer:", data.get("answer"))
except json.JSONDecodeError:
    print("(Plain text response — not JSON)")
