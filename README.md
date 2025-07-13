# Code Explainer

A beautiful React app with a Python FastAPI backend that lets you write code, highlight to explain, or run code. Uses Ollama Gemma3 for code explanations.

## Features
- Write code in a modern editor
- Highlight code to get an instant explanation (as if you were 5)
- Click 'Explain Code' to explain all code
- Click 'Run Code' to execute Python code
- Beautiful, modern UI

## Requirements
- Python 3.9+
- Node.js 16+
- [Ollama](https://ollama.com/) installed and running locally with the `gemma:3b` model pulled

## Setup

### Backend
1. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # or
   source venv/bin/activate  # On Mac/Linux
   ```
2. Install dependencies:
   ```sh
   pip install fastapi uvicorn python-multipart aiofiles ollama
   ```
3. Make sure Ollama is running and you have the model:
   ```sh
   ollama pull gemma:3b
   ollama serve
   ```
4. Start the backend:
   ```sh
   uvicorn backend.main:app --reload
   ```

### Frontend
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```sh
   npm start
   ```

The frontend will be available at [http://localhost:3000](http://localhost:3000) and the backend at [http://localhost:8000](http://localhost:8000).