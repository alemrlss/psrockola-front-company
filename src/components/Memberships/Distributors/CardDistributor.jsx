/* eslint-disable react/prop-types */
import { Button, Card, CardContent, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import getBenefitsDistributorMembership from "../../../utils/getBenefitsDistributorMembership";
import { useTranslation } from "react-i18next";

function CardDistributor({ membership, onClick, setMembership }) {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        backgroundColor: "#555CB3",
        color: "white",
        borderRadius: "15px",
        width: "320px",
        height: "380px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="text-xl flex items-center font-bold space-x-2">
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {membership.name}
          </Typography>
        </div>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "white",
            fontSize: "2rem",
          }}
        >
          {membership.currency === "usd" ? "$" : "$"}
          {membership.amount / 100}
          {membership.currency === "usd" ? " USD" : ""}
          {membership.interval === "month"
            ? `/${t("view_memberships_card_month")}`
            : `/${t("view_memberships_card_year")}`}
        </Typography>

        <div className="space-y-1 flex flex-col">
          <Typography variant="body1">
            <CheckIcon sx={{ color: "#04FA72", marginRight: 1 }} />
            Maximo {
              getBenefitsDistributorMembership(membership.type).accounts
            }{" "}
            Cuentas
          </Typography>
        </div>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "#F66E0C",
            fontWeight: "bold",
            letterSpacing: "1px",
            borderRadius: "50px",
            "&:hover": {
              backgroundColor: "#ffebcd",
              color: "#F66E0C",
            },
            transition: "all 0.3s ease",
          }}
          fullWidth
          onClick={() => {
            setMembership(membership);
            onClick();
          }}
        >
          {t("view_memberships_card_get")}
        </Button>
      </CardContent>
    </Card>
  );
}

export default CardDistributor;
