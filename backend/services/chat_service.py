from groq import Groq
from core.config import settings
from models.schemas import ChatRequest, ChatResponse

client = Groq(api_key=settings.GROQ_API_KEY)

def chat_with_ai(request: ChatRequest) -> ChatResponse:
    system_prompt = (
        "You are a helpful and knowledgeable culinary AI assistant inside a recipe maker application. "
        "Keep your answers concise, friendly, and formatted nicely.\n\n"
        "🚨 VERY IMPORTANT RULES:\n"
        "You MUST strictly behave exactly as a Recipe Assistant only.\n"
        "ONLY answer questions regarding recipes, cooking steps, ingredients, or food-related suggestions.\n"
        "NEVER answer questions about coding, programming, general knowledge, personal questions, or anything unrelated to food.\n"
        "If the user asks something completely unrelated to cooking, you MUST politely refuse and respond EXACTLY with:\n"
        "\"I'm your Recipe AI assistant 👨‍🍳. I can only help with cooking and recipes.\"\n"
        "Do not apologize or explain further, strictly return that exact string."
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
