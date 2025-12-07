import os
from google.generativeai import GenerativeModel, configure
from .embedding_service import EmbeddingService
from .qdrant_service import QdrantService

embedding_service = EmbeddingService()
qdrant_service = QdrantService()

# Configure Gemini API
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set for Python backend.")
configure(api_key=gemini_api_key)
GEMINI_GENERATIVE_MODEL = 'gemini-2.5-flash'

async def get_rag_response(message: str, selected_text: str | None = None):
    # The user's question is the primary query for search
    query_text = message

    # If text is selected, we use that to refine the search query
    if selected_text:
        query_text = f"User's question: '{message}' --- Context from selected text: '{selected_text}'"
    
    query_embedding = embedding_service.encode([query_text])[0]
    search_results = qdrant_service.search(query_embedding)

    # --- ENHANCED PROMPT CONSTRUCTION ---
    prompt_parts = [
        "You are a helpful expert assistant for the \"Physical AI & Humanoid Robotics\" textbook.",
        "Your task is to answer the user's question. Use the provided context to form your answer.",
        "Be concise, professional, and helpful. If the context does not contain the answer, say that you couldn't find the specific information in the provided materials, but try to answer based on your general knowledge of the topic if appropriate.",
        "\n--- CONTEXT ---"
    ]

    # **CRITICAL FIX**: Prioritize the user's selected text by adding it to the context first.
    if selected_text:
        prompt_parts.append("\n**User-Selected Text:**\n")
        prompt_parts.append(selected_text)
        prompt_parts.append("\n---")
    
    # Add supplementary context from the vector search
    context_chunks = [
        hit["payload"].get("content") 
        for hit in search_results 
        if hit.get("payload") and hit["payload"].get("content")
    ]
    if context_chunks:
        prompt_parts.append("\n**Relevant Excerpts from the Book:**\n")
        prompt_parts.append("\n---\n".join(context_chunks))

    # Handle the case where no context is found at all
    if not selected_text and not context_chunks:
        prompt_parts.append("\nNo specific context was provided or found.")

    prompt_parts.append("\n--- END OF CONTEXT ---\n")
    prompt_parts.append(f"**User's Question:**\n{message}\n\n**Answer:**\n")
    
    full_prompt = "\n".join(prompt_parts)

    # Make LLM call to Gemini
    model = GenerativeModel(GEMINI_GENERATIVE_MODEL)
    try:
        response = await model.generate_content_async(full_prompt)
        response_text = response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        response_text = "An error occurred while generating the response."
        
    # Format sources for the frontend
    sources = [
        hit["payload"].get("source") 
        for hit in search_results 
        if hit.get("payload") and hit["payload"].get("source")
    ]
    unique_sources = list(set(sources))
    formatted_sources = [f"{source}" for source in unique_sources]

    return response_text, formatted_sources