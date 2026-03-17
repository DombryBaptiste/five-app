import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "./services/authService";
import GoogleLogin from "./components/GoogleLogin/GoogleLogin";
import UserProfile from "./components/UserProfile/UserProfile";
import "./App.css";
import { Tooltip } from "react-tooltip";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const unsubscribe = authService.onAuthChange((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Nettoyage
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <>
      <div className="app-container">
        <h1>Five App - Gérez vos événements</h1>

        {user ? (
          <UserProfile user={user} onLogout={() => setUser(null)} />
        ) : (
          <GoogleLogin onLoginSuccess={setUser} />
        )}
      </div>
      <ToastContainer />
      <Tooltip
        id="generic-tooltip"
      />
    </>
  );
}

export default App;