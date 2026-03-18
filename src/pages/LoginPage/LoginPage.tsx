import GoogleLogin from "../../components/GoogleLogin/GoogleLogin";
import { useNavigate, Navigate } from "react-router-dom";
import useAuth from "../../context/use-auth";
import "./LoginPage.css";

export default function LoginPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if(user)
    {
        return <Navigate to="/" replace/>
    }

    const handleLogin = () => {
        navigate("/" , { replace: true });
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <span className="football-icon">⚽</span>
                <h1 className="login-title">Five App</h1>
                <p className="login-subtitle">Rejoignez la communauté du football</p>
                <div className="google-login-button">
                    <GoogleLogin onLoginSuccess={handleLogin} />
                </div>
            </div>
        </div>
    );
}