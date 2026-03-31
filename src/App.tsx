import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import useAuth from "./context/use-auth";
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fr";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <RouterProvider router={router} />
        <ToastContainer />
      </LocalizationProvider>
    </>
  );
}

export default App;
