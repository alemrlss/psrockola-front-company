import { useState, useEffect } from "react";
import api from "../../../api/api";
import { useSelector } from "react-redux";

function ScreenSubcompany() {
  const user = useSelector((state) => state.auth.user);
  const [screens, setScreens] = useState([]);


  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await api.get("/screen/subcompany/" + user.id);
        setScreens(response.data.data.screens);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };

    fetchScreens();
  }, []);

  return (
    <div>
      <h2 className="text-5xl mb-8">Screens</h2>
      {screens.length > 0 ? (
        <div>
          {screens.map((screen) => (
            <div key={screen.id} className="bg-gray-300 p-4">
              <p className="font-bold text-2xl">{screen.name}</p>
              <h3 className="text-xl">Code: {screen.code}</h3>
              {/* Aquí renderiza más detalles de la pantalla si es necesario */}
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando pantallas...</p>
      )}
    </div>
  );
}

export default ScreenSubcompany;
