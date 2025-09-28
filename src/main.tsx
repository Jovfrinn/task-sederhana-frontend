import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import JoinedProject from "./pages/Dashboard/JoinedProject";
import Layout from "./components/Layouts";
import Task from "./pages/Task/Task";
import ProtectedRoute from "./components/protectedRoute";
import AppInitializer from "@/components/AppInitializer";
import Register from "./pages/auth/Register";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navigate to="/dashboard" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "project/:id",
        element: (
          <ProtectedRoute>
            <Task />
          </ProtectedRoute>
        ),
      },
      {
        path: "project/joined",
        element: (
          <ProtectedRoute>
            <JoinedProject />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </Provider>
  </React.StrictMode>
);
