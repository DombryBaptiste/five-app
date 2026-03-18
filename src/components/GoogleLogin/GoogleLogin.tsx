import { useState } from "react";
import authService from "../../services/authService";
import type { User } from "firebase/auth";
import { toast } from "react-toastify";
import "./GoogleLogin.css";
import { FaGoogle } from "react-icons/fa";

interface GoogleLoginProps {
  onLoginSuccess?: (user: User) => void;
}

/**
 * Composant de connexion Google
 * Affiche un bouton pour se connecter avec Google
 */
export default function GoogleLogin({ onLoginSuccess }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      toast.success(`✓ Bienvenue ${user.displayName || "!"}`);
      onLoginSuccess?.(user);
      console.log("Utilisateur connecté:", user)
    } catch (error) {
      toast.error("✗ Erreur de connexion Google");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="google-login-btn"
    >
      {isLoading ? "Connexion en cours..." : "Se connecter avec Google"}
      <FaGoogle />
    </button>
  );
}
