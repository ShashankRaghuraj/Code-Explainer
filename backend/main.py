from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str = "python"

@app.post("/explain")
async def explain_code(req: CodeRequest):
    prompt = (
        "Explain this Python code like in short, intuitive sentence. "
        "No introductions, no formatting, no emojis, no follow-up, no extra comments, no preambles. "
        "Use a real-world example only if it makes it simpler, don't use it all the time, only use it when the example is complex like recursion or data structures and algorithms, "
        "on simple print lines don't use it, or checking to see if it's odd. For those that are pretty hard concepts, like recursion or data structures, make the explination a bit more user friendly:\n"
        f"{req.code}"
    )
    response = ollama.chat(model="gemma3", messages=[{"role": "user", "content": prompt}])
    return {"explanation": response['message']['content']}

@app.post("/run")
async def run_code(req: CodeRequest):
    if req.language == "python":
        try:
            result = subprocess.run([
                "python", "-c", req.code
            ], capture_output=True, text=True, timeout=5)
            return {"output": result.stdout, "error": result.stderr}
        except Exception as e:
            return {"output": "", "error": str(e)}
    return {"output": "", "error": "Unsupported language"} 