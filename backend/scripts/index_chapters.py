import os
import glob
import uuid
from dotenv import load_dotenv

from backend.app.utils.chunking import semantic_chunking
from backend.app.services.embedding_service import EmbeddingService
from backend.app.services.qdrant_service import QdrantService

load_dotenv()

def index_chapters():
    print("Starting chapter indexing...")

    # Initialize services (assuming they can be initialized without FastAPI app context for script use)
    embedding_service = EmbeddingService() # Assuming default constructor
    qdrant_service = QdrantService()       # Assuming default constructor

    chapter_files = glob.glob("frontend/docs/chapter-*.md")
    if not chapter_files:
        print("No chapter files found in website/docs/. Please ensure chapters exist.")
        return

    for file_path in chapter_files:
        print(f"Processing {file_path}...")
        with open(file_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()

        chunks = semantic_chunking(markdown_content)

        for i, chunk in enumerate(chunks):
            chunk_content = chunk["content"]
            metadata = chunk["metadata"]
            metadata["source"] = file_path # Update source to actual file path
            metadata["chunk_number"] = i
            
            # Generate a unique UUID for the Qdrant point
            point_id = str(uuid.uuid4())

            # Generate embedding
            embedding = embedding_service.encode([chunk_content])[0] # Pass as list and take first element

            # Store in Qdrant
            qdrant_service.upsert_chunks(ids=[point_id], vectors=[embedding], payloads=[metadata])

    print("Chapter indexing completed.")

if __name__ == "__main__":
    index_chapters()
