import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { syncUserRole } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const SESSION_KEY = "sciars_auth_session";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

const firebaseErrorMessage = (code) => {
  const map = {
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/invalid-credential": "Invalid email or password",
    "auth/email-already-in-use": "An account with this email already exists",
    "auth/too-many-requests": "Too many attempts. Please try again later",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/network-request-failed": "Network error. Check your connection",
    "auth/not-allowed": "You are not authorized to login as this role",
    "auth/registration-disabled": "Registration is disabled for this role",
  };
  return map[code] || "Authentication failed. Please try again.";
};

// Helper to get session data from either storage
const getStoredSession = () => {
  const local = localStorage.getItem(SESSION_KEY);
  if (local) return JSON.parse(local);
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session) return JSON.parse(session);
  
  // Fallback for old multi-key system
  for (const r of ["user", "supervisor", "admin"]) {
    const old = localStorage.getItem(`session_${r}`);
    if (old) return JSON.parse(old);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Eagerly restore role from storage
    const session = getStoredSession();
    if (session?.role) {
      setRole(session.role);
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const session = getStoredSession();
        if (session?.role) {
          setRole(session.role);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password, selectedRole, rememberMe = false) => {
    // 1. Set Firebase persistence
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

    // 2. Sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // 3. Sync role with backend
    try {
      const token = await fbUser.getIdToken();
      await syncUserRole(selectedRole, token);
    } catch (err) {
      await signOut(auth);
      throw new Error("auth/not-allowed");
    }

    // 4. Store session metadata
    const sessionData = {
      email: fbUser.email,
      role: selectedRole,
      uid: fbUser.uid,
      displayName: fbUser.displayName || "",
      persistent: rememberMe
    };

    // Use appropriate storage based on rememberMe
    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      localStorage.removeItem(SESSION_KEY);
    }

    setRole(selectedRole);
    setUser(fbUser);
    return fbUser;
  };

  const register = async (email, password, displayName, selectedRole) => {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    if (displayName) {
      await updateProfile(fbUser, { displayName });
    }

    try {
      const token = await fbUser.getIdToken();
      await syncUserRole(selectedRole, token);
    } catch (err) {
      await signOut(auth);
      throw new Error("auth/not-allowed");
    }

    const sessionData = {
      email: fbUser.email,
      role: selectedRole,
      uid: fbUser.uid,
      displayName: displayName || "",
      persistent: true
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setRole(selectedRole);
    setUser(fbUser);
    return fbUser;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    // Clear legacy keys
    localStorage.removeItem("session_user");
    localStorage.removeItem("session_supervisor");
    localStorage.removeItem("session_admin");
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    loading,
    login,
    register,
    logout,
    firebaseErrorMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
