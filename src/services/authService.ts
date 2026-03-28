import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "../config/firebase";
import storageService from "./storageService";
import type { UserInfos } from "../type/UserInfos";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Service d'authentification Firebase avec Google
 */
class AuthService {
  private googleProvider = new GoogleAuthProvider();
  private currentUserRole: string | null = null;

  /**
   * Se connecter avec Google
   * @returns {Promise<User>} L'utilisateur connecté
   * @throws {Error} En cas d'erreur d'authentification
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      if (result.user !== null) {
        storageService.setCurrentUser(result.user);
        await this.createUserIfNotExists();
        await this.loadUserRole();
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

  getCurrentUserInfos(): UserInfos {
    if(auth.currentUser == null) throw Error("L'utilisateur actuel n'existe pas");
    const userInfos: UserInfos = {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName != null ? auth.currentUser.displayName : "",
    };
    return userInfos;
  }

  async createUserIfNotExists() {
    const user = auth.currentUser;

    if (!user) throw new Error("Aucun utilisateur connecté");

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName ?? "",
        email: user.email ?? "",
        role: "user",
      });
    }
  }

async loadUserRole(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists()) {
    this.currentUserRole = snap.data().role;
  }
}


  isCurrentUserAdmin(): boolean {
    return this.currentUserRole === "admin";
  }
}

export default new AuthService();
