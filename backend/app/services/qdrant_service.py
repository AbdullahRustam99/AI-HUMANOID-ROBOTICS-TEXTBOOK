import os
from qdrant_client import QdrantClient, models
from typing import List, Dict, Any

class QdrantService:
    def __init__(self):
        """
        Initializes the QdrantService, setting up the client and ensuring the collection exists.
        """
        self.qdrant_url = os.getenv("QDRANT_URL")
        self.qdrant_api_key = os.getenv("QDRANT_API_KEY")
        self.collection_name = "textbook_chunks"
        self.vector_size = 384  # Based on the all-MiniLM-L6-v2 model

        if not self.qdrant_url:
            raise ValueError("QDRANT_URL must be set in environment variables.")

        # The QdrantClient can be initialized with or without an API key.
        # If the key is None, it will connect to a local or unsecured Qdrant instance.
        self.client = QdrantClient(
            url=self.qdrant_url,
            api_key=self.qdrant_api_key,
        )
        self.ensure_collection()

    def ensure_collection(self):
        """
        Checks if the required collection exists in Qdrant and creates it if it doesn't.
        """
        try:
            self.client.get_collection(collection_name=self.collection_name)
            print(f"Collection '{self.collection_name}' already exists.")
        except Exception:
            print(f"Collection '{self.collection_name}' not found, creating it...")
            self.client.recreate_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=self.vector_size, distance=models.Distance.COSINE),
            )
            print(f"Collection '{self.collection_name}' created successfully.")

    def upsert_chunks(self, ids: List[str], vectors: List[List[float]], payloads: List[Dict[str, Any]]):
        if not (len(ids) == len(vectors) == len(payloads)):
            raise ValueError("ids, vectors, and payloads must have the same length")

        points = [
            models.PointStruct(id=id_, vector=vector, payload=payload)
            for id_, vector, payload in zip(ids, vectors, payloads)
        ]

        self.client.upsert(
            collection_name=self.collection_name,
            points=points,
            wait=True
        )
        print(f"Upserted {len(points)} chunks successfully.")

    def search(self, query_vector: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """
        Performs a vector search in the Qdrant collection.
        
        Args:
            query_vector: The vector representation of the query.
            limit: The maximum number of results to return.
            
        Returns:
            A list of search results, each containing the payload and score.
        """
        print(f"Searching Qdrant with a vector...")
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit,
            with_payload=True,  # Ensure the payload is returned with the results
        )
        
        # The modern client returns ScoredPoint objects
        results = [
            {"payload": hit.payload, "score": hit.score}
            for hit in search_results
        ]
        
        print(f"Qdrant search completed. Found {len(results)} results.")
        return results