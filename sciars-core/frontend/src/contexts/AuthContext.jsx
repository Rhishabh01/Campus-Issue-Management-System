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

// Helper to restore role from localStorage session keys
const restoreRoleFromStorage = () => {
  for (const r of ["user", "supervisor", "admin"]) {
    const session = localStorage.getItem(`session_${r}`);
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data.email) return r;
      } catch {}
    }
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Eagerly restore role from localStorage so ProtectedRoute doesn't
    // redirect before onAuthStateChanged has a chance to fire
    const storedRole = restoreRoleFromStorage();
    if (storedRole) setRole(storedRole);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Firebase user exists — restore role from localStorage
        const restoredRole = restoreRoleFromStorage();
        if (restoredRole) {
          setRole(restoredRole);
        }
      } else {
        // User signed out or session expired
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password, selectedRole, rememberMe = false) => {
    // Set persistence BEFORE signing in:
    // - LOCAL: persists across browser restarts (Remember Me checked)
    // - SESSION: cleared when tab/browser closes (Remember Me unchecked)
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

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
      displayName: fbUser.displayName || "",
    };

    localStorage.setItem(`session_${selectedRole}`, JSON.stringify(sessionData));
    setRole(selectedRole);
    setUser(fbUser);

    return fbUser;
  };

  const register = async (email, password, displayName, selectedRole) => {
    // Registration always uses local persistence
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
    };

    localStorage.setItem(`session_${selectedRole}`, JSON.stringify(sessionData));
    setRole(selectedRole);
    setUser(fbUser);

    return fbUser;
  };

  const logout = async () => {
    await signOut(auth);
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