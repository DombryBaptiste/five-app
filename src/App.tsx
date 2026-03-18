import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import useAuth from "./context/use-auth";
import { ToastContainer } from "react-toastify";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
    
  );
}

export default App;