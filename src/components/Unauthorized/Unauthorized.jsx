import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Unauthorized() {
  const user = useSelector((state) => state.auth.user);

  const getRole = (type) => {
    if (type === 23) {
      return "companies/dashboard";
    }
    if (type === 22) {
      return "employees/dashboard";
    }

    if (type === 25) {
      return "distributors/dashboard";
    }
    return "login";
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
      <p className="text-lg mb-8">You do not have access to this page.</p>
      <Link
        to={`/${getRole(user?.type)}`}
        className="text-blue-500 underline hover:text-blue-700"
      >
        {user ? "Go to dashboard" : "Login"}
      </Link>
    </div>
  );
}

export default Unauthorized;
