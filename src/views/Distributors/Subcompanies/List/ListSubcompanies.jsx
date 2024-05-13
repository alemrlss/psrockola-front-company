import React, { useState, useEffect } from "react";
import api from "../../../../api/api";
import { useSelector } from "react-redux";

function ListSubcompanies() {
  const user = useSelector((state) => state.auth.user);
  const [subcompanies, setSubcompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcompanies = async () => {
      try {
        const response = await api.get("/subcompany/distributor/" + user.id);
        setSubcompanies(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subcompanies:", error);
        setLoading(false);
      }
    };

    fetchSubcompanies();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Subcompanies</h2>
      {subcompanies.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {subcompanies.map((subcompany) => (
            <li key={subcompany.id} className="py-4 bg-slate-300">
              <div>
                <strong className="text-gray-800">Name:</strong>{" "}
                {subcompany.name}
              </div>
              <div>
                <strong className="text-gray-800">Email:</strong>{" "}
                {subcompany.email}
              </div>
              <div>
                <strong className="text-gray-800">Address:</strong>{" "}
                {subcompany.address}
              </div>
              <div>
                <strong className="text-gray-800">Phone:</strong>{" "}
                {subcompany.phone}
              </div>
              {/* Renderizar otros detalles de la subcompany según sea necesario */}
            </li>
          ))}
        </ul>
      ) : (
        <div>No subcompanies found.</div>
      )}
    </div>
  );
}

export default ListSubcompanies;
