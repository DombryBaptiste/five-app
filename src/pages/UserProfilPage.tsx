import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import UserProfile from "../components/UserProfile/UserProfile";
import authService from "../services/authService";

export default function UserProfilPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const unsubscribe = authService.onAuthChange((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Nettoyage
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <p>Chargement...</p>;
  }
  
    return (
        <div>
            <UserProfile user={user} onLogout={() => setUser(null)}/>
        </div>
    );
}