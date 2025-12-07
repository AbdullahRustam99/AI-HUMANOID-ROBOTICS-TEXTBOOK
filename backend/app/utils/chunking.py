import markdown
import re
from typing import List, Dict, Any

def semantic_chunking(markdown_content: str, min_tokens: int = 100, max_tokens: int = 512, overlap_tokens: int = 50) -> List[Dict[str, Any]]:
    """
    Splits markdown content into semantic chunks, respecting heading boundaries.

    Args:
        markdown_content: The full markdown content of a document.
        min_tokens: Minimum token count for a chunk.
        max_tokens: Maximum token count for a chunk.
        overlap_tokens: Number of tokens to overlap between chunks.

    Returns:
        A list of dictionaries, where each dictionary represents a chunk
        and contains 'content' and 'metadata' (e.g., 'source', 'heading').
    """
    chunks = []
    # This is a placeholder. A real implementation would involve tokenization
    # and more sophisticated logic to respect headings and token limits.
    # For now, we'll split by paragraphs as a simple approximation.
    paragraphs = markdown_content.split('\n\n')

    current_chunk_content = ""
    current_heading = "Introduction" # Default heading

    for paragraph in paragraphs:
        if paragraph.strip().startswith('#'): # Detect a new heading
            current_heading = paragraph.strip().lstrip('# ').strip()

        # Simple token count approximation (word count)
        paragraph_tokens = len(paragraph.split())

        if len(current_chunk_content.split()) + paragraph_tokens > max_tokens:
            if current_chunk_content.strip():
                chunks.append({
                    "content": current_chunk_content.strip(),
                    "metadata": {"source": "unknown", "heading": current_heading}
                })
            current_chunk_content = paragraph
        else:
            current_chunk_content += "\n\n" + paragraph

    if current_chunk_content.strip():
        chunks.append({
            "content": current_chunk_content.strip(),
            "metadata": {"source": "unknown", "heading": current_heading}
        })

    return chunks

