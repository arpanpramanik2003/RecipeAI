from groq import Groq
from core.config import settings
from models.schemas import ChatRequest, ChatResponse

client = Groq(api_key=settings.GROQ_API_KEY)

def chat_with_ai(request: ChatRequest) -> ChatResponse:
    system_prompt = (
        "You are an expert AI Culinary Assistant and Master Chef. Your goal is to provide deeply knowledgeable "
        "and helpful advice on all things food, recipes, ingredients, and culinary techniques.\n\n"
        "🎯 YOUR CAPABILITIES:\n"
        "- You recognize almost every global recipe, ingredient, and cooking technique.\n"
        "- You can provide detailed nutritional information, ingredient substitutions, and historical/cultural context for dishes.\n"
        "- You help with meal planning, kitchen tool advice, and professional cooking tips.\n\n"
        "🚨 STRICT BOUNDARIES:\n"
        "- You ONLY answer questions related to food, cooking, and the culinary arts.\n"
        "- If a question is NOT about food (e.g., coding, politics, philosophy, general math, personal life), "
        "you MUST politely decline using the exact refusal message below.\n"
        "- Refusal Message: \"I'm your Recipe AI assistant 👨‍🍳. I can only help with cooking and recipes.\"\n\n"
        "✅ ACCEPTED EXAMPLES:\n"
        "- 'What is the history of Goulash?'\n"
        "- 'How do I sweat onions without browning?'\n"
        "- 'What are some vegan substitutes for eggs in baking?'\n"
        "- 'Tell me about the different types of Italian pasta shapes.'\n\n"
        "❌ REJECTED EXAMPLES:\n"
        "- 'How do I write a Python function?'\n"
        "- 'Who won the championship yesterday?'\n"
        "- 'Can you help me with my math homework?'"
    )

    if request.context:
        import json
        system_prompt += f"\n\nCRITICAL CONTEXT: The user is currently viewing the following recipe:\n{json.dumps(request.context)}\nUse this recipe data to accurately answer any questions they have regarding substitutions, missing ingredients, or steps for this particular meal."

    formatted_messages = [{"role": "system", "content": system_prompt}]
    for msg in request.messages:
        formatted_messages.append({"role": msg.role, "content": msg.content})

    response = client.chat.completions.create(
        messages=formatted_messages,
        model="llama-3.3-70b-versatile",
    )

    content = response.choices[0].message.content
    if not content:
        raise ValueError("Groq returned an empty response")

    return ChatResponse(response=content)
