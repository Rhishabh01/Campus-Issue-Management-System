import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

firebase_key = os.environ.get("FIREBASE_KEY")

try:
    if firebase_key:
        # Production (Render) uses environment variable
        cred_dict = json.loads(firebase_key)
        cred = credentials.Certificate(cred_dict)
    else:
        # Local development uses the JSON file
        # Check if file exists first
        key_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
        else:
            raise ValueError("No FIREBASE_KEY env var and no serviceAccountKey.json found.")
    
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"🔥 FIREBASE INITIALIZATION ERROR: {e}")
    # Initialize a dummy db or set to None so the app still boots
    db = None