import useAuth from "../../context/use-auth";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import "./UserProfilPage.css";
import { useNavigate } from "react-router-dom";

export default function UserProfilPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      toast.error("Erreur déconnexion");
      console.error(error);
    }
  };

  const handleCalendarClick = () => {
    navigate("/calendar");
  }

  if (loading) return <p>Chargement...</p>;
  if (!user) return null;

  return (
    <div className="user-page">
      <div className="user-card">
        <h1 className="user-title">Mon profil</h1>

        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="avatar"
            className="user-avatar"
          />
        )}

        <p className="user-name">
          {user.displayName || "Utilisateur"}
        </p>

        <p className="user-email">{user.email}</p>

        <button className="create-btn" onClick={handleCalendarClick}>
          Calendrier des dispos
        </button>

        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Se déconnecter
        </button>
      </div>
    </div>
  );
}