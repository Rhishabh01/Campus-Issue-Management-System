from fastapi import Depends, HTTPException, Request
from firebase_admin import auth


def get_current_user(request: Request):
    """
    FastAPI dependency that extracts and verifies the Firebase ID token
    from the Authorization header.

    Usage:
        @router.get("/protected")
        def protected_route(user=Depends(get_current_user)):
            return {"email": user["email"], "uid": user["uid"]}
    """
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail={"success": False, "message": "Missing or invalid authorization header"},
        )from fastapi import Request

def get_current_user(request: Request):
    # 🔥 Allow preflight requests to pass
    if request.method == "OPTIONS":
        return None

    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth_header.split("Bearer ")[1]

    try:
        decoded_token = auth.verify_id_token(token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email", ""),
            "name": decoded_token.get("name", ""),
            "email_verified": decoded_token.get("email_verified", False),
        }
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "message": "Token has expired. Please sign in again."},
        )
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "message": "Invalid authentication token."},
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "message": f"Authentication failed: {str(e)}"},
        )
