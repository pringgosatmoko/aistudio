import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { supabase } from "./services/supabaseClient";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Auth wrapper: jika belum login, redirect ke login
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Ambil session saat ini
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listener jika auth berubah (login/logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Router setup
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/", element: <ProtectedRoute><Dashboard /></ProtectedRoute> }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
