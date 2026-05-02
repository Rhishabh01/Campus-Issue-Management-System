import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from routers import issues, notifications, users

# Initialize app
app = FastAPI()

# =========================
# CORS CONFIGURATION
# =========================

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "https://project-krqoz-8dbi04osj-rhishabh01s-projects.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,   # MUST be False with "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# PREFLIGHT HANDLER (FIX)
# =========================

@app.options("/{full_path:path}")
async def preflight_handler(request: Request):
    return {}

# =========================
# ROUTES
# =========================

app.include_router(issues.router, prefix="/api/issues", tags=["Issues"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

# =========================
# ROOT CHECK
# =========================

@app.get("/")
def root():
    return {"message": "SCIARS API is running 🚀"}

# =========================
# LOCAL RUN
# =========================

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)