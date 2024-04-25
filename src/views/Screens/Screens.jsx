import { Box, Button, Modal, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";
import AddIcon from "@mui/icons-material/Add";
import { loadStripe } from "@stripe/stripe-js";
import ModalCreateScreen from "../../components/Screens/Create/ModalCreateScreen";
import ModalEditScreen from "../../components/Screens/Edit/ModalEditScreen";

const stripePromise = loadStripe(
  "pk_test_51M4ShsFeiEj6y242YNiI1u9Kf1HZM4eHjMZYMeHYrTCHwRfSIA3JwC5znJfpmk0EZWlLbsvQ9wXQZbLAdJZsdhUD00dehK0IeW"
);

function Screens() {
  const user = useSelector((state) => state.auth.user);
  const [screens, setScreens] = useState([]);
  const [screenLimit, setScreenLimit] = useState(0);

  const [screen, setScreen] = useState({
    name: "",
    password: "",
  });

  //Estado para todo los erores
  const [error, setError] = useState("");

  //Estados para cambiar la contraseña
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingScreen, setIsCreatingScreen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditingScreen, setIsEditingScreen] = useState(false);

  //Estado para el switch
  const [loadingSwitch, setLoadingSwitch] = useState(false);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await api.get(`/screen/company/${user.id}`);
        setScreens(response.data.data.screens);
        setScreenLimit(response.data.data.screenLimit);

        const activeScreens = response.data.data.screens.filter(
          (screen) => screen.active
        );
        console.log(activeScreens);
        setScreensActive(activeScreens);
      } catch (error) {
        console.error("Error al obtener las membresías:", error);
      }
    };

    fetchScreens();
  }, []);

  //Modal funciones de creación
  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setScreen({ name: "", password: "" });
    setError("");
    setIsCreateModalOpen(false);
  };

  //Modal funciones de edición
  const handleEditModalOpen = (screen) => {
    setScreen(screen);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setScreen({ name: "", password: "" });
    setPassword("");
    setConfirmPassword("");
    setError("");
    setIsEditModalOpen(false);
  };

  // Funcion para crear una pantalla
  const handleCreateScreen = async () => {
    setError("");
    if (!screen.name || !screen.password) {
      setError("Name and password are required");
      return;
    }
    setIsCreatingScreen(true);
    try {
      const response = await api.post("stripe/create-checkout-session-screen", {
        screenName: screen.name,
        userId: user.id,
        password: screen.password,
      });
      const sessionId = response.data.sessionId;
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId,
      });
      setIsCreatingScreen(false);
      setError(null);
    } catch (error) {
      setIsCreatingScreen(false);

      if (
        error.response &&
        error.response.data &&
        error.response.data.statusCode === 400 &&
        error.response.data.message === "SCREEN_LIMIT_EXCEEDED"
      ) {
        console.error("¡Límite de pantallas excedido!");
        setError(
          "Límite de pantallas excedido. No puedes comprar más pantallas."
        );
      } else {
        setError("Error al crear la pantalla. Inténtalo de nuevo más tarde.");
      }
    }
  };

  // Funcion para editar nombre de una pantalla
  const handleEditNameScreen = async () => {
    try {
      // Realizar la llamada al backend para guardar los cambios
      await api.patch(`/screen/${screen.id}`, {
        name: screen.name,
      });

      // Actualizar localmente la información en el estado userScreens
      setScreens((prevScreens) =>
        prevScreens.map((screenfound) =>
          screenfound.id === screen.id
            ? { ...screenfound, name: screen.name, password: screen.password }
            : screenfound
        )
      );

      handleEditModalClose();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setError("Error al guardar los cambios. Inténtalo de nuevo más tarde.");
    }
  };

  // Funcion para editar contraseña de una pantalla
  const handleEditPasswordScreen = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.trim() === "") {
      setError("Password is required");
      return;
    }
    if (confirmPassword.trim() === "") {
      setError("Confirm Password is required");
      return;
    }

    setIsEditingScreen(true);
    try {
      // Realizar la llamada al backend para guardar los cambios
      await api.patch(`/screen/change-password/${screen.id}`, {
        newPassword: password,
      });

      // Actualizar localmente la información en el estado userScreens
      setScreens((prevScreens) =>
        prevScreens.map((screenfound) =>
          screenfound.id === screen.id
            ? { ...screenfound, name: screen.name, password: screen.password }
            : screenfound
        )
      );
      setIsEditingScreen(false);

      handleEditModalClose();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setError("Error al guardar los cambios. Inténtalo de nuevo más tarde.");
      setIsEditingScreen(false);
    }
  };

  //Funcion para el switch de las pantallas
  const handleSwitchChange = async (screenId, isActive) => {
    try {
      // Habilitar el estado de carga
      setLoadingSwitch(true);

      // Realizar la llamada al backend para cambiar el estado 'active'
      await api.patch(`/screen/toggle/${screenId}`, {
        userId: user.id,
      });

      // Actualizar localmente el estado de la pantalla solo si la llamada al backend tiene éxito
      setScreens((prevScreens) =>
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
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          my: 2,
        }}
      >
        <h2 className="text-3xl font-bold my-4">Screens: {screens.length}</h2>
        <Button
          variant="contained"
          disabled={screens.length >= screenLimit}
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
          sx={{
            backgroundColor: screens.length >= screenLimit ? "gray" : "green",
            "&:hover": {
              backgroundColor: screens.length >= screenLimit ? "gray" : "green",
            },
          }}
        >
          Add Screen
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          my: 2,
        }}
      >
        <h2 className="text-xl font-bold">
          Active:{" "}
          {
            screens.filter((screen) => {
              return screen.active;
            }).length
          }
          /{screenLimit} Limit
        </h2>
      </Box>
      <ul className="grid grid-cols-2 gap-4">
        {screens.map((screen) => (
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
                className="ml-2"
                onClick={() => {
                  handleEditModalOpen(screen);
                }}
              >
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <ModalCreateScreen
        isCreateModalOpen={isCreateModalOpen}
        handleCreateModalClose={handleCreateModalClose}
        screen={screen}
        setScreen={setScreen}
        handleCreateScreen={handleCreateScreen}
        isCreatingScreen={isCreatingScreen}
        error={error}
      />

      <ModalEditScreen
        isEditModalOpen={isEditModalOpen}
        handleEditModalClose={handleEditModalClose}
        handleEditPasswordScreen={handleEditPasswordScreen}
        handleEditNameScreen={handleEditNameScreen}
        isEditingScreen={isEditingScreen}
        screen={screen}
        setScreen={setScreen}
        error={error}
        setError={setError}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
      />
    </Box>
  );
}

export default Screens;
