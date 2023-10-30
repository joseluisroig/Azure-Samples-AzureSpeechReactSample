import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';  // Importar desde firebase.js
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";  // Añadir estas importaciones

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  
    const unsubscribe = onAuthStateChanged(auth, setUser);

    return () => {
      unsubscribe();
    };
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [auth]);  // Puedes ignorar la advertencia de ESLint sobre esta dependencia si 'auth' no cambia

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Error durante la autenticación", error);
    }
  };

  const value = {
    user,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
