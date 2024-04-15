import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../api/api";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(
  "pk_test_51M4ShsFeiEj6y242YNiI1u9Kf1HZM4eHjMZYMeHYrTCHwRfSIA3JwC5znJfpmk0EZWlLbsvQ9wXQZbLAdJZsdhUD00dehK0IeW"
);

function Screens() {
  const [screenName, setScreenName] = useState("");
  const [password, setPassword] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [userScreens, setUserScreens] = useState([]);
  const [error, setError] = useState(null);
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [editedScreenName, setEditedScreenName] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editError, setEditError] = useState(null);

  const [errorEmpty, setErrorEmpty] = useState("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/screen/company/${user.id}`);
        setUserScreens(response.data.data);
      } catch (error) {
        console.error("Error al obtener las membresías:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (openCheckout && sessionId) {
      redirectToCheckout(sessionId);
    }
  }, [openCheckout, sessionId]);

  const handleCreateScreen = async () => {
    setEditError(null);

    if (!screenName || !password) {
      setErrorEmpty("Please fill in all fields");
      return;
    }

    try {
      const response = await api.post("stripe/create-checkout-session-screen", {
        screenName,
        userId: user.id,
        password,
      });

      // Extrae el sessionId de la respuesta
      const sessionId = response.data.sessionId;

      // Almacena el sessionId en el estado para su posterior uso
      setSessionId(sessionId);

      // Abre el flujo de pago de Stripe
      setOpenCheckout(true);

      // Limpiar cualquier error previo
      setError(null);
    } catch (error) {
      console.error("Error al obtener el sessionId:", error);

      // Verifica si el error es debido a que se excedió el límite de pantallas
      if (
        error.response &&
        error.response.data &&
        error.response.data.statusCode === 400 &&
        error.response.data.message === "SCREEN_LIMIT_EXCEEDED"
      ) {
        // Maneja el caso específico de límite de pantallas excedido
        console.error("¡Límite de pantallas excedido!");

        // Actualiza el estado de error para mostrar el mensaje en la interfaz
        setError(
          "Límite de pantallas excedido. No puedes comprar más pantallas."
        );
      } else {
        // Maneja otros errores según tus necesidades
        // Puedes mostrar un mensaje de error genérico o realizar otras acciones

        // Actualiza el estado de error para mostrar el mensaje en la interfaz
        setError("Error al crear la pantalla. Inténtalo de nuevo más tarde.");
      }
    }
  };

  const redirectToCheckout = async (sessionId) => {
    try {
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      // Maneja cualquier error que pueda ocurrir al redirigir
      if (error) {
        console.error("Error al redirigir a Checkout:", error);
        // Maneja el error según tus necesidades (puede mostrar un mensaje al usuario)

        // Actualiza el estado de error para mostrar el mensaje en la interfaz
        setError("Error al iniciar el pago. Inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error al redirigir a Checkout:", error);
      // Maneja el error según tus necesidades (puede mostrar un mensaje al usuario)

      // Actualiza el estado de error para mostrar el mensaje en la interfaz
      setError("Error al iniciar el pago. Inténtalo de nuevo más tarde.");
    }
  };

  const handleSwitchChange = async (screenId, isActive) => {
    try {
      // Habilitar el estado de carga
      setLoadingSwitch(true);

      // Realizar la llamada al backend para cambiar el estado 'active'
      await api.patch(`/screen/toggle/${screenId}`, {
        userId: user.id,
      });

      // Actualizar localmente el estado de la pantalla solo si la llamada al backend tiene éxito
      setUserScreens((prevScreens) =>
        prevScreens.map((screen) =>
          screen.id === screenId ? { ...screen, active: !isActive } : screen
        )
      );
    } catch (error) {
      console.error(
        `Error al cambiar el estado de la pantalla ${screenId}:`,
        error
      );

      // Mostrar el mensaje de error en la interfaz
      if (
        error.response &&
        error.response.data &&
        error.response.data.statusCode === 400 &&
        error.response.data.message === "SCREEN_LIMIT_EXCEEDED"
      ) {
        // Manejar el caso específico de límite de pantallas excedido
        setError(
          "Límite de pantallas excedido. No puedes activar más pantallas."
        );
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.statusCode === 400 &&
        error.response.data.message === "SCREEN_HAS_PENDING_VIDEOS"
      ) {
        // Manejar el caso específico de que la pantalla tenga videos pendientes
        setError(
          "No puedes desactivar la pantalla porque tiene videos pendientes."
        );
      } else {
        setError(
          "Error al cambiar el estado de la pantalla. Inténtalo de nuevo más tarde."
        );
      }
    } finally {
      // Deshabilitar el estado de carga una vez que la petición se completa (éxito o fallo)
      setLoadingSwitch(false);
    }
  };

  const handleEditClick = (screen) => {
    setEditingScreen(screen);
    setEditedScreenName(screen.name);
    setEditedPassword(screen.password);
    setEditError(null);
  };

  const handleEditSave = async () => {
    try {
      // Realizar la llamada al backend para guardar los cambios
      await api.patch(`/screen/${editingScreen.id}`, {
        name: editedScreenName,
      });

      // Actualizar localmente la información en el estado userScreens
      setUserScreens((prevScreens) =>
        prevScreens.map((screen) =>
          screen.id === editingScreen.id
            ? { ...screen, name: editedScreenName, password: editedPassword }
            : screen
        )
      );

      // Cerrar el modal de edición
      setEditingScreen(null);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);

      // Mostrar el error en el modal
      setEditError(
        "Error al guardar los cambios. Inténtalo de nuevo más tarde."
      );
    }
  };

  return (
    <div className="p-4">
      <div>
        <h2 className="text-2xl font-bold mt-10">Create Screen</h2>
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Name screen"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            className="border rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Password Screen"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleCreateScreen}
          >
            Create
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {errorEmpty && (
          <p className="text-red-500 mt-2 font-bold">{errorEmpty}</p>
        )}
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Screens: {userScreens.length}
        </h2>
        <ul className="grid grid-cols-2 gap-4">
          {userScreens.map((screen) => (
            <li
              key={screen.id}
              className={`mb-2 p-4 rounded-md ${
                screen.active ? "bg-gray-300" : "bg-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  {screen.code} - {screen.name}
                </p>
                <span className="text-gray-500">{screen.resolution}</span>
              </div>
              <p className="mt-2">{screen.description}</p>

              <div className="flex items-center mt-2">
                <Switch
                  checked={screen.active}
                  onChange={() => handleSwitchChange(screen.id, screen.active)}
                  disabled={loadingSwitch}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditClick(screen)}
                  className="ml-2"
                >
                  Edit
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Elements stripe={stripePromise}></Elements>

      <Modal
        open={!!editingScreen}
        onClose={() => setEditingScreen(null)}
        aria-labelledby="modal-edit-screen"
      >
        <Box className="p-4 bg-white w-96 mx-auto mt-20 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Edit Screen</h2>
          <TextField
            label="New Name"
            variant="outlined"
            fullWidth
            value={editedScreenName}
            onChange={(e) => setEditedScreenName(e.target.value)}
            className="mb-2"
          />
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            type="text"
            value={editedPassword}
            onChange={(e) => setEditedPassword(e.target.value)}
            className="mb-2"
          />
          {editError && <p className="text-red-500 mt-2">{editError}</p>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditSave}
            className="mt-4"
          >
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Screens;
