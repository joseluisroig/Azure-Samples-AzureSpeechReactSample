import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const Autenticador = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Error durante la autenticación", error);
    }
  };

  return (
    <div>
      {user ? (
        <span>Bienvenido, {user.displayName}</span>
      ) : (
        <button 
          style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} 
          onClick={signInWithGoogle}
        >
          Iniciar sesión con Google
        </button>
      )}
    </div>
  );
};

export default Autenticador;

