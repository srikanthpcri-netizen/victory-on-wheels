import { Navigate } from "react-router-dom";

type ProtectedCustomerRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedCustomerRoute({
  children,
}: ProtectedCustomerRouteProps) {
  const token = localStorage.getItem("customerToken");
  const phone = localStorage.getItem("customerPhone");

  if (!token || !phone) {
    return <Navigate to="/customer-login" replace />;
  }

  return <>{children}</>;
}
