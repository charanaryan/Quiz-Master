import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [userData, setUserData] = useState(null); // MongoDB user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const res = await axios.get(`http://localhost:5000/api/users/${firebaseUser.uid}`);
          setUserData(res.data);

          // Store it for fallback (optional)
          localStorage.setItem("userId", firebaseUser.uid);
          localStorage.setItem("role", res.data.role);
        } catch (error) {
          console.error("Failed to fetch user data from backend", error);
        }
      } else {
        setUser(null);
        setUserData(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
