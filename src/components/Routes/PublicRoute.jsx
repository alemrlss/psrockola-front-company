import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
export default function PublicRoute() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const dimeElRol = (user) => {
    if (user.type === 23) {
      return "/companies";
    }
    if (user.type === 22) {
      return "/employees";
    }
    if (user.type === 24) {
      return "/subcompanies";
    }
    if (user.type === 25) {
      return "/distributors";
    }
  };

  if (isAuthenticated) {
    return <Navigate to={`${dimeElRol(user)}/dashboard`} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
