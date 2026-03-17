import type { User } from "firebase/auth";
import authService from "../../services/authService";
import { toast } from "react-toastify";
import "./UserProfile.css";
import { FaSignOutAlt } from "react-icons/fa";

interface UserProfileProps {
  user: User | null;
  onLogout?: () => void;
}

/**
 * Affiche le profil de l'utilisateur connecté
 */
export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("✓ Déconnecté");
      onLogout?.();
    } catch (error) {
      toast.error("✗ Erreur déconnexion");
      console.error(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile" data-tooltip-id="tooltip" data-tooltip-content={"TEST"}>
      <div className="user-info">
        {user.photoURL && (
          <img src={user.photoURL} alt={user.displayName || "User"} />
        )}
        <div>
          <p className="user-name">{user.displayName || "Utilisateur"}</p>
          <p className="user-email">{user.email}</p>
        </div>
      </div>
      <div>
        <button
          onClick={handleLogout} className="logout-btn"
          data-tooltip-id="generic-tooltip" data-tooltip-content="Se déconnecter"
        >
        <FaSignOutAlt />
      </button>
      </div>
      
    </div>
  );
}
