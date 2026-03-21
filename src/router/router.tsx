// src/router/router.tsx
import { createHashRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import ProtectedRoute from "../components/protectedRoute";
import UserProfilPage from "../pages/UserProfilPage/UserProfilPage";
import CalendarPage from "../pages/CalendarPage/CalendarPage";
import CalendarGlobalPage from "../pages/CalendarGlobalPage/CalendarGlobalPage";

export const router = createHashRouter([
  {
    path: "/login",
    element: <LoginPage />,
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
  },
  {
    path: '/calendar-global',
    element: (
      <ProtectedRoute>
        <CalendarGlobalPage />
      </ProtectedRoute>
    )
  }
]);