import { useEffect, useState } from "react";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import LastPayTransactions from "../../../components/Distributors/Dashboard/LastPayTransactions";
import TransactionsSubcompany from "../../../components/Distributors/Dashboard/TransactionsSubcompany";
import Prueba from "../../../components/Distributors/Dashboard/Prueba";
import { useTranslation } from "react-i18next";
import { Modal, Box, Typography, Button } from "@mui/material"; // Importar componentes de Material-UI

const DashboardDistributor = () => {
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [subcompanyReproductions, setSubcompanyReproductions] = useState([]);
  const [transactionsBySubcompany, setTransactionsBySubcompany] = useState([]);
  const [daysLeft, setDaysLeft] = useState(null); // Nuevo estado para los días restantes
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/distributors/" + user.id);
        const info = response.data.data;

        setRecentTransactions(info.recentPayTransactions);
        setSubcompanyReproductions(info.subcompanyReproductions);
        setTransactionsBySubcompany(info.transactionsBySubCompany);

        // Calcular los días restantes para la membresía
        const expirationDate = new Date(user.membership.expiration);
        const today = new Date();
        const timeDiff = expirationDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setDaysLeft(daysLeft);

        if (daysLeft <= 7 && daysLeft >= 0) {
          setIsModalOpen(true); // Mostrar el modal si faltan entre 0 y 7 días
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
        setError(
          "Error con la conexión al servidor, por favor intente más tarde..."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [auth, user.membership.expiration]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <div className="flex justify-center items-center text-red-500 text-center lg:bg-red-100 rounded-md py-6 px-2">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <h2 className="font-bold text-[#555CB3] text-2xl mb-4">
              {t("view_dashboard_welcome")} {user.name}!
            </h2>
          </div>
          <TransactionsSubcompany data={transactionsBySubcompany} />
          <Prueba data={subcompanyReproductions} />
          <LastPayTransactions data={recentTransactions} />
        </>
      )}

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="membership-expiration-modal"
        aria-describedby="membership-expiration-description"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded shadow-lg">
          <Typography
            id="membership-expiration-modal"
            variant="h6"
            component="h2"
          >
            ¡Atención!
          </Typography>
          <Typography id="membership-expiration-description" sx={{ mt: 2 }}>
            Faltan {daysLeft} días para que termine tu membresía.
          </Typography>
          <Button
            onClick={() => {
              window.location.href = "/distributors/subscriptions/get";
            }
            }
            variant="outlined"
            color="primary"
            sx={{ mt: 4, mr: 2 }}
          >
            Renovar
          </Button>
          <Button
            onClick={closeModal}
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </section>
  );
};

export default DashboardDistributor;
