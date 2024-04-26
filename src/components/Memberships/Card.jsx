/* eslint-disable react/prop-types */
import { Button, Card, CardContent, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import getBenefitsMembership from "../../utils/getBenefitsMembership";
import getIconForMembershipType from "../../utils/getIconForMembershipType";
import { useTranslation } from "react-i18next";

function CardSubscription({ membership, onClick, setMembership }) {
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        backgroundColor: "#F66E0C",
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
          {getIconForMembershipType(membership.type).icon}
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
          {membership.amount}
          {membership.currency === "usd" ? " USD" : ""}
          {membership.interval === "month"
            ? `/${t("view_memberships_card_month")}`
            : `/${t("view_memberships_card_year")}`}
        </Typography>

        <div className="space-y-1 flex flex-col">
          <Typography variant="body1">
            <CheckIcon sx={{ color: "#04FA72", marginRight: 1 }} />
            {getBenefitsMembership(membership.type).sales}{" "}
            {getBenefitsMembership(membership.type).sales === "1"
              ? t("view_memberships_card_employees_account_singular")
              : t("view_memberships_card_employees_account_plural")}{" "}
            {t("view_memberships_card_employees")}
          </Typography>
          <Typography variant="body1">
            <CheckIcon sx={{ color: "#04FA72", marginRight: 1 }} />
            {getBenefitsMembership(membership.type).skins === "1"
              ? `${getBenefitsMembership(membership.type).skins} ${t(
                  "view_memberships_card_skins_singular"
                )}`
              : `${getBenefitsMembership(membership.type).skins} ${t(
                  "view_memberships_card_skins_plural"
                )}`}
          </Typography>
          <Typography variant="body1">
            <CheckIcon sx={{ color: "#04FA72", marginRight: 1 }} />
            {t("view_memberships_card_screens_start")}{" "}
            {getBenefitsMembership(membership.type).screens}{" "}
            {t("view_memberships_card_screens_end")}
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

export default CardSubscription;
