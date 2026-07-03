import { Navigate } from "react-router-dom";
import { isServiceCenterLoggedIn } from "../utils/serviceCenterAuth";
import type { ReactNode } from "react";

type ProtectedServiceCenterRouteProps = {
  children: ReactNode;
};

export default function ProtectedServiceCenterRoute({
  children,
}: ProtectedServiceCenterRouteProps) {
  const loggedIn = isServiceCenterLoggedIn();

  if (!loggedIn) {
    return <Navigate to="/service-center-login" replace />;
  }

  return <>{children}</>;
}
