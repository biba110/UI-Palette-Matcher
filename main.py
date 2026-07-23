from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import os
os.environ["OMP_NUM_THREADS"] = "1"
import torch
torch.set_num_threads(1)

# 1. Start the API application instance
app = FastAPI()

# 2. Add CORS Middleware (Essential for connecting to Next.js later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this would be your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load the design data and model (This runs once when the server starts)
print("Starting API and loading design database...")
df = pd.read_csv("ui_dataset_batched.csv")
moods = df["mood_industry"].tolist()

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(moods, convert_to_numpy=True)
dimension = embeddings.shape[1] 
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Update the endpoint to accept an optional category parameter
@app.get("/api/recommend")
def get_recommendation(mood: str, category: str = "All"):
    # Combine category and mood for precise vector embedding alignment
    if category != "All":
        search_prompt = f"{category} industry design: {mood}"
    else:
        search_prompt = mood

    # Convert the enhanced prompt into vector coordinates
    query_vector = model.encode([search_prompt], convert_to_numpy=True)
    distances, indices = index.search(query_vector, 3)

    results = []
    for i in range(3):
        row_index = indices[0][i]
        match = df.iloc[row_index]

        results.append(
            {
                "mood_industry": match["mood_industry"],
                "primary_color": match["primary_color"],
                "secondary_color": match["secondary_color"],
                "background_color": match["background_color"],
                "text_color": match["text_color"],
                "accent_color": match["accent_color"],
                "heading_font": match["heading_font"],
                "body_font": match["body_font"],
            }
        )

    return {
        "query": mood,
        "category": category,
        "recommendations": results,
    }
