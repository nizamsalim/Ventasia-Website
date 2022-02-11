import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AppContext from "../Contexts/AppContext";

export function ProtectedContainer() {
  const { user } = useContext(AppContext);
  return user == null ? <Navigate to={"/auth/login/user"} /> : <Outlet />;
}

export function AuthContainer() {
  const { user } = useContext(AppContext);
  return user !== null ? <Navigate to={"/"} /> : <Outlet />;
}
