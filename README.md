# Physical AI & Humanoid Robotics Textbook (AI-Powered)

This project is an interactive, AI-powered textbook focused on Physical AI and Humanoid Robotics. It features a Docusaurus frontend for content delivery and a FastAPI Python backend for a Retrieval-Augmented Generation (RAG) chatbot and a multi-language translation service.

## Features

*   **Docusaurus Frontend:** Modern, responsive, and easy-to-navigate textbook interface.
*   **RAG Chatbot:** Ask questions about the textbook content and get AI-generated answers with source citations.
*   **Contextual Chat:** Select any text on a page, and a "Chat with AI" button appears, allowing you to ask questions specifically about that selected text.
*   **Multi-language Translation:** Translate chapter content to Urdu, Sindhi, Pashto, and Balochi.
*   **Python FastAPI Backend:** Powers the RAG chatbot and translation service using the Gemini API and Qdrant vector database.

## Project Structure

*   `frontend/`: Contains the Docusaurus-based textbook website.
    *   `frontend/src/theme/Root.tsx`: Main React component wrapping the entire Docusaurus app, integrating the chatbot and text selection logic.
    *   `frontend/docusaurus.config.ts`: Docusaurus configuration, including `customFields` for backend URL.
    *   `frontend/.env`: Frontend environment variables (e.g., `DOCUSAURUS_PYTHON_BACKEND_URL`).
*   `backend/`: Contains the FastAPI Python application.
    *   `backend/app/main.py`: Main FastAPI application, including CORS middleware and API routers.
    *   `backend/app/api/query.py`: RAG chatbot endpoint.
    *   `backend/app/api/translate.py`: Translation endpoint.
    *   `backend/app/services/`: Qdrant, Embedding services.
    *   `backend/scripts/index_chapters.py`: Script to process and index Docusaurus chapter content into Qdrant.
    *   `backend/requirements.txt`: Python dependencies.
    *   `backend/.env`: Backend environment variables (e.g., `GEMINI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`).
*   `vercel.json`: Vercel deployment configuration for the frontend.

## Local Setup

### Prerequisites

*   Node.js (LTS recommended)
*   npm
*   Python 3.8+
*   pip
*   A Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))
*   A Qdrant instance (local or cloud, e.g., Qdrant Cloud) with its URL and API Key.

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create a Python Virtual Environment (recommended):**
    ```bash
    python -m venv venv
    .\venv\Scripts\activate # On Windows
    source venv/bin/activate # On macOS/Linux
    ```
3.  **Install Python Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Create `.env` file:** In the `backend/` directory, create a file named `.env` and add your credentials:
    ```dotenv
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY_FOR_BACKEND
    QDRANT_URL=YOUR_QDRANT_URL
    QDRANT_API_KEY=YOUR_QDRANT_API_KEY
    ```
    *Replace placeholders with your actual keys and URL.*

5.  **Index Chapter Data into Qdrant:**
    *   This script reads your Docusaurus chapter files from `frontend/docs`, chunks them, generates embeddings, and stores them in Qdrant.
    *   Make sure your Qdrant instance is running and accessible via `QDRANT_URL` and `QDRANT_API_KEY`.
    *   Run from the project root (one level above `backend/`):
        ```bash
        python -m backend.scripts.index_chapters
        ```
    *   You should see output indicating chapter processing and successful upsertion to Qdrant.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install Node.js Dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:** In the `frontend/` directory, create a file named `.env` and add the backend URL:
    ```dotenv
    DOCUSAURUS_PYTHON_BACKEND_URL=http://localhost:8000/api
    ```
    *Note: If your backend runs on a different host/port, update `localhost:8000` accordingly.*

## Running the Application Locally

### 1. Run the Backend Server

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Activate your virtual environment** (if not already active).
3.  **Start the FastAPI application:**
    ```bash
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --env-file <path_to_your_backend_env_file>
    ```
    *(Replace `<path_to_your_backend_env_file>` with the actual path, e.g., `.env` or `app/services/.env` if you placed it there.)*
    You should see output indicating the server is running on `http://0.0.0.0:8000`.

### 2. Run the Frontend Development Server

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Start the Docusaurus development server:**
    ```bash
    npm start
    ```
    This will open your Docusaurus site in your web browser, usually at `http://localhost:3000/`.

## How to Use Locally

*   **RAG Chatbot:** Click the floating chat icon (💬) on the bottom right. Type your questions related to the textbook content.
*   **Contextual Chat:** Select any text on a chapter page. A "Chat with AI" button will appear above the selection. Click it to open the chatbot with the selected text as context.
*   **Translation:** On any chapter page, use the language dropdown at the top of the content area. Select a language (Urdu, Sindhi, Pashto, Balochi) and click "Translate" to see the content translated. Click "Show English" to revert.

## Deployment to Vercel (Frontend)

To deploy your Docusaurus frontend to Vercel:

1.  **Ensure your project is on GitHub.**
2.  **Install Vercel CLI (if not already installed):** `npm install -g vercel`
3.  **Log in to Vercel:** `vercel login`
4.  **Deploy from Project Root:** Navigate to your project's root directory (`Ai_Rebotic_Book/`) and run: `vercel`
    *   Vercel will detect the `vercel.json` file and guide you through the setup.
    *   **Important:** When prompted, ensure the **Root Directory** is set to `frontend`.
5.  **Configure Environment Variables in Vercel:** In your Vercel project settings (dashboard), add an environment variable:
    *   **Name:** `DOCUSAURUS_PYTHON_BACKEND_URL`
    *   **Value:** `http://<your-public-backend-url>/api`
        *(Replace `<your-public-backend-url>` with the actual public URL of your deployed Python backend.)*

## Deployment of Python Backend

Your Python FastAPI backend needs to be deployed to a platform that supports Python applications (e.g., Railway, Render, Fly.io, Google Cloud Run, etc.). Once deployed, you will get a public URL for your backend, which you will then use for `DOCUSAURUS_PYTHON_BACKEND_URL` in your Vercel frontend environment variables.

---

Feel free to open issues or contribute to this project!