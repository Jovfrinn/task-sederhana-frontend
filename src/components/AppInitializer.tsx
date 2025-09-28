import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile } from "@/slices/authSlice";
import type { AppDispatch } from "@/store";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;
