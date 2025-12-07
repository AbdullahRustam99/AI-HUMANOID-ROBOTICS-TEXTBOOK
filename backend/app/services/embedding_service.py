from sentence_transformers import SentenceTransformer
from typing import List

class EmbeddingService:
    def __init__(self):
        # Load the sentence-transformers model (all-MiniLM-L6-v2)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def encode(self, texts: List[str]) -> List[List[float]]:
        """
        Encodes a list of texts into embeddings.

        Args:
            texts: A list of strings to encode.
            
        Returns:
            A list of embedding vectors.
        """
        if isinstance(texts, str):
            texts = [texts] # Ensure texts is a list for batch processing
        embeddings = self.model.encode(texts).tolist()
        return embeddings

