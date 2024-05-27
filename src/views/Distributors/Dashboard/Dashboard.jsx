import { useEffect, useState } from "react";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import LastPayTransactions from "../../../components/Distributors/Dashboard/LastPayTransactions";
import ReproductionsSubcompany from "../../../components/Distributors/Dashboard/ReproductionsSubcompany";
import TransactionsBySubcompany from "../../../components/Distributors/Dashboard/transactionsBySubcompany";

const DashboardDistributor = () => {
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [subcompanyReproductions, setSubcompanyReproductions] = useState([]);
  const [transactionsBySubcompany, setTransactionsBySubcompany] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/distributors/" + user.id);
        const info = response.data.data;

        setRecentTransactions(info.recentPayTransactions);
        setSubcompanyReproductions(info.subcompanyReproductions);
        setTransactionsBySubcompany(info.transactionsBySubCompany);

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
  }, [auth]);

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
              Welcome, {user.name}!
            </h2>
          </div>
          <TransactionsBySubcompany data={transactionsBySubcompany} />
          <ReproductionsSubcompany data={subcompanyReproductions} />
          <LastPayTransactions data={recentTransactions} />
        </>
      )}
    </section>
  );
};

export default DashboardDistributor;
