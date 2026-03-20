import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../config/firebase";
import storageService from "./storageService";

/**
 * Service d'authentification Firebase avec Google
 */
class AuthService {
  private googleProvider = new GoogleAuthProvider();

  /**
   * Se connecter avec Google
   * @returns {Promise<User>} L'utilisateur connecté
   * @throws {Error} En cas d'erreur d'authentification
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      if(result.user !== null) {
        storageService.setCurrentUser(result.user);
      }
      return result.user;
    } catch (error) {
      console.error("Erreur authentification Google:", error);
      throw error;
    }
  }

  /**
   * Se déconnecter
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  }

  /**
   * Obtenir l'utilisateur actuel
   * @returns {Promise<User | null>} L'utilisateur ou null
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Écouter les changements d'authentification
   * @param {Function} callback - Fonction appelée quand l'auth change
   * @returns {Function} Fonction pour arrêter l'écoute
   */
  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUserId(): string | undefined {
    return auth.currentUser?.uid
  }
}

export default new AuthService();
