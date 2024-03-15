import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
      <p className="text-lg mb-8">You do not have access to this page.</p>
      <Link to="/dashboard" className="text-blue-500 underline hover:text-blue-700">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default Unauthorized;
