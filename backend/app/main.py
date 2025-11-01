from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import users, protected


app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(users.router)
app.include_router(protected.router)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}
