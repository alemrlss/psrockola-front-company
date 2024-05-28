import { Grid, Typography } from "@mui/material";
import ReproductionsCard from "./ReproductionsCard";
import { useTranslation } from "react-i18next";

function ReproductionsForScreen({ data }) {
  const { t } = useTranslation();
  const availableScreens = data.length;

  // Calcula el tamaño de las columnas en función del número de pantallas disponibles
  const columnSize = availableScreens > 0 ? Math.floor(12 / Math.min(availableScreens, 3)) : 12;

  return (
    <>
      {availableScreens > 0 ? (
        <>
          <h2 className="text-center font-bold text-xl mb-2">
            {t("view_dashboard_screens_reproductions")}
          </h2>
          <Grid container spacing={2} wrap="wrap">
            {data.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={columnSize} key={index}>
                <ReproductionsCard
                  screen={item.screen}
                  reproductions={item.screenReproductions}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography variant="body1" align="center" color="textSecondary">
          {t("no_screens_available_message")}
        </Typography>
      )}
    </>
  );
}

export default ReproductionsForScreen;
