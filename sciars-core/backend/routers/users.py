from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from middleware.auth import get_current_user
from services.firebase_admin import db
from datetime import datetime

router = APIRouter()

class RoleSyncRequest(BaseModel):
    role: str

@router.post("/sync")
def sync_user_role(payload: RoleSyncRequest, user=Depends(get_current_user)):
    return {"message": "User synced successfully"}
    try:
        user_uid = user.get("uid")
        user_email = user.get("email", "").lower()
        requested_role = payload.role

        if requested_role not in ["user", "supervisor", "admin"]:
            raise HTTPException(status_code=400, detail={"success": False, "message": "Invalid role"})

        # If requesting supervisor or admin, check the allowed_emails config
        if requested_role in ["supervisor", "admin"]:
            config_ref = db.collection("config").document("allowed_emails")
            config_doc = config_ref.get()
            
            allowed_emails = []
            if config_doc.exists:
                data = config_doc.to_dict()
                if requested_role == "supervisor":
                    allowed_emails = data.get("supervisor_emails", [])
                elif requested_role == "admin":
                    allowed_emails = data.get("admin_emails", [])
            
            # Use defaults if config is empty or missing
            if not allowed_emails:
                if requested_role == "admin":
                    allowed_emails = ["admin@campus.edu"]
                elif requested_role == "supervisor":
                    allowed_emails = [
                        "electrical@campus.edu", "water@campus.edu", "clean@campus.edu",
                        "infra@campus.edu", "access@campus.edu", "safety@campus.edu",
                        "transport@campus.edu", "environment@campus.edu"
                    ]
            
            allowed_emails_lower = [email.lower() for email in allowed_emails]
            
            if user_email not in allowed_emails_lower:
                raise HTTPException(
                    status_code=403,
                    detail={"success": False, "message": f"auth/not-allowed"}
                )

        # Update or create user document with the verified role
        user_ref = db.collection("users").document(user_uid)
        
        user_data = {
            "email": user_email,
            "role": requested_role,
            "displayName": user.get("name", "")
        }
        
        # Merge true so we don't overwrite createdAt if it exists
        user_ref.set(user_data, merge=True)
        
        # If the document was newly created, it won't have createdAt. Let's ensure it has one.
        doc = user_ref.get()
        if not doc.to_dict().get("createdAt"):
            user_ref.update({"createdAt": datetime.utcnow().isoformat() + "Z"})

        return {"success": True, "message": "Role synchronized", "role": requested_role}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "message": str(e)})
