import { useState, useEffect } from "react";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import { Typography, Button, Card, CardContent, Grid } from "@mui/material";

function RockobitsBuy() {
  const [packages, setPackages] = useState([]);
  const user = useSelector((state) => state.auth.user);

  //test
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        //test
        const walletResponse = await api.get(`/wallet/${user.id}`);
        setWalletBalance(walletResponse.data.data.amount);
        //

        const response = await api.get("package-rockobits");
        setPackages(response.data.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleBuyClick = async (packageId) => {
    try {
      const response = await api.post(
        "/stripe/create-checkout-session-package",
        {
          packageId,
          userId: user.id,
        }
      );
      const { sessionId } = response.data;
      redirectToCheckout(sessionId);
    } catch (error) {
      console.error("Error al iniciar el proceso de compra:", error);
    }
  };

  const redirectToCheckout = async (sessionId) => {
    try {
      const stripe = await Stripe(
        "pk_test_51M4ShsFeiEj6y242YNiI1u9Kf1HZM4eHjMZYMeHYrTCHwRfSIA3JwC5znJfpmk0EZWlLbsvQ9wXQZbLAdJZsdhUD00dehK0IeW"
      );
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        console.error("Error al redirigir a Checkout:", result.error);
      }
    } catch (error) {
      console.error("Error al redirigir a Checkout:", error);
    }
  };
  return (
    <div className="container mx-auto">
      <p className="text-gray-400 ml-10 absolute text-2xl">
        Wallet: {walletBalance} <b>Rockobits</b>
      </p>
      <div className="flex justify-center items-center">
        <Typography variant="h4" align="center" gutterBottom>
          <b>Rockobits packages</b>
        </Typography>
      </div>

      <Grid container spacing={3}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {pkg.rockobitsAmount} Rockobits
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Price: ${(pkg.price / 100).toFixed(2)} USD
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {pkg.name}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBuyClick(pkg.id)}
                  sx={{
                    backgroundColor: "#F79303",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#E98B05",
                    },
                  }}
                >
                  Buy
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default RockobitsBuy;
