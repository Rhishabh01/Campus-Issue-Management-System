import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseFirestore";

const DEFAULT_ALLOWED_EMAILS = {
  supervisor: [
    "electrical@campus.edu",
    "water@campus.edu",
    "clean@campus.edu",
    "infra@campus.edu",
    "access@campus.edu",
    "safety@campus.edu",
    "transport@campus.edu",
    "environment@campus.edu",
  ],
  admin: [
    "admin@campus.edu",
  ],
};

let cachedEmails = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export const fetchAllowedEmails = async () => {
  const now = Date.now();
  
  if (cachedEmails && (now - lastFetch) < CACHE_DURATION) {
    return cachedEmails;
  }

  try {
    const docRef = doc(db, "config", "allowed_emails");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      cachedEmails = {
        supervisor: data.supervisor_emails || DEFAULT_ALLOWED_EMAILS.supervisor,
        admin: data.admin_emails || DEFAULT_ALLOWED_EMAILS.admin,
      };
    } else {
      cachedEmails = DEFAULT_ALLOWED_EMAILS;
    }
    lastFetch = now;
    return cachedEmails;
  } catch (error) {
    console.warn("Failed to fetch allowed emails:", error);
    return DEFAULT_ALLOWED_EMAILS;
  }
};

export const isEmailAllowed = async (email, role) => {
  const allowed = await fetchAllowedEmails();
  const emails = allowed[role] || [];
  return emails.map(e => e.toLowerCase()).includes(email.toLowerCase());
};

export const getAllowedEmails = async (role) => {
  const allowed = await fetchAllowedEmails();
  return allowed[role] || [];
};

export const ALLOWED_EMAILS = DEFAULT_ALLOWED_EMAILS;
export const isEmailAllowedSync = (email, role) => {
  const allowed = DEFAULT_ALLOWED_EMAILS[role] || [];
  return allowed.map(e => e.toLowerCase()).includes(email.toLowerCase());
};