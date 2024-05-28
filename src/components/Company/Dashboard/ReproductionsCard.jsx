import { Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function ReproductionsCard({ screen, reproductions }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {screen.code}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center", fontSize: 18 }}>
          {t("view_dashboard_reproductions")}: <b>{reproductions}</b>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ReproductionsCard;
