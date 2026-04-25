import firebase_admin
from firebase_admin import credentials, auth as fb_auth
import os
import sys

SERVICE_ACCOUNT = os.path.join(os.path.dirname(__file__), "backend/services/serviceAccountKey.json")

def init_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate(SERVICE_ACCOUNT)
        firebase_admin.initialize_app(cred)

def create_user(email: str, password: str):
    init_firebase()
    try:
        user = fb_auth.create_user(email=email, password=password)
        print(f"✓ Created user: {user.uid} ({email})")
        return user
    except firebase_admin._auth_utils.EmailAlreadyExistsError:
        print(f"✗ User already exists: {email}")
    except Exception as e:
        print(f"✗ Error: {e}")

def delete_user(email: str):
    init_firebase()
    try:
        user = fb_auth.get_user_by_email(email)
        fb_auth.delete_user(user.uid)
        print(f"✓ Deleted user: {email}")
    except firebase_admin._auth_utils.UserNotFoundError:
        print(f"User not found: {email}")
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage:")
        print("  python create_user.py create email password")
        print("  python create_user.py delete email")
        print("")
        print("Example:")
        print("  python create_user.py create admin@campus.edu password123")
        print("  python create_user.py create supervisor1@campus.edu password123")
    else:
        action = sys.argv[1]
        email = sys.argv[2]
        password = sys.argv[3] if len(sys.argv) > 3 else None
        
        if action == "create":
            if not password:
                print("Password required for create")
            else:
                create_user(email, password)
        elif action == "delete":
            delete_user(email)
        else:
            print(f"Unknown action: {action}")