import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          email: firebaseUser.email,
          createdAt: new Date().toISOString(),
          settings: { darkMode: true }
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      } else {
        setUser(userSnap.data());
      }
    } catch (error) {
      console.warn("Error al sincronizar datos de Firestore:", error);
      // Fallback para evitar que la interfaz se congele si falla la red
      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuario",
        email: firebaseUser.email,
      });
    } finally {
      setLoading(false); // Garantiza que la app siempre renderice la interfaz
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      syncUserProfile(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const register = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", res.user.uid);
    const newUser = {
      uid: res.user.uid,
      name,
      email,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(userRef, newUser);
    } catch (e) {
      console.warn("No se pudo guardar el documento inicial:", e);
    }
    setUser(newUser);
  };

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};