import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import getBenefits from "../../../../utils/getBenefits";
import api from "../../../../api/api";
import { useSelector, useDispatch } from "react-redux";
import { updateUserMembership } from "../../../../features/authSlice";

function Cancel() {
  const token = useSelector((state) => state.auth.token);
  console.log(token);

  const [membership, setMembership] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const userFound = await api.get(`/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembership(userFound.data.data.activeMembership);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMembership();
  }, []);

  const handleCancelConfirmation = () => {
    const cancelMembership = async () => {
      try {
        const response = await api.post(
          `/membership/cancel-subscription/${user.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setMembership(null);
        setShowConfirmationModal(false);

        dispatch(
          updateUserMembership({
            name: null,
            type: null,
            expiration: null,
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    cancelMembership();
  };

  return (
    <div className="flex items-center flex-col justify-center">
      <div className="bg-blue-200 p-8 rounded-lg shadow-md text-center mb-4">
        {membership && (
          <div>
            <p className="text-2xl font-semibold mb-4">Membresia activa: </p>
            <p className="text-gray-600">{membership.name}</p>
            <p className="text-gray-600">
              Tipo de membresia: {getBenefits(membership).type}
            </p>
            <p className="text-gray-600"> Beneficios: </p>
            <p className="text-gray-600">
              Dispositivos de ventas: {getBenefits(membership).sales}
            </p>
            <p className="text-gray-600">
              {" "}
              Skins: {getBenefits(membership).skins}
            </p>
            <p className="text-gray-600">
              Personalizar ModePlays:{" "}
              {getBenefits(membership).customModePlay ? "Si" : "No"}
            </p>
          </div>
        )}
      </div>
      {membership && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowConfirmationModal(true)}
          >
            Cancelar Membresia
          </Button>
          <Modal
            open={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
          >
            <Box
              sx={{
                position: "absolute",
                width: 400,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" component="div">
                ¿Estás seguro de que deseas cancelar tu membresía?
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelConfirmation}
                sx={{ m: 1 }}
              >
                Confirmar Cancelación
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowConfirmationModal(false)}
                sx={{ m: 1 }}
              >
                Cancelar
              </Button>
            </Box>
          </Modal>
        </>
      )}

      {!membership && (
        <div>
          <h2 className="text-red-400 text-6xl">
            No cuentas con una membresía activa.
          </h2>
        </div>
      )}
    </div>
  );
}

export default Cancel;
