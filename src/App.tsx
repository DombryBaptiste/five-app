import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import useAuth from "./context/use-auth";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  return <RouterProvider router={router} />;
}

export default App;