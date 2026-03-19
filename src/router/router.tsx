// src/router/router.tsx
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import ProtectedRoute from "../components/protectedRoute";
import CreateEventPage from "../pages/CreateEventPage";
import UserProfilPage from "../pages/UserProfilPage/UserProfilPage";
import CalendarPage from "../pages/CalendarPage/CalendarPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/events",
    element: (
      <ProtectedRoute>
        <CreateEventPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <UserProfilPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <CalendarPage />
      </ProtectedRoute>
    )
  }
]);