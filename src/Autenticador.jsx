import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const Autenticador = () => {

  const signInWithGoogle = async () => {
    console.log("Intentando autenticar con Google");  // Depuración
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Autenticado con éxito", result.user);  // Depuración
    } catch (error) {
      console.error("Error durante la autenticación", error);  // Depuración
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Iniciar sesión con Google</button>
    </div>
  );
};

export default Autenticador;

