import { Grid, Typography } from "@mui/material";
import ReproductionsCard from "./ReproductionsCard";
import { useTranslation } from "react-i18next";

function ReproductionsForScreen({ data }) {
  const { t } = useTranslation();
  const availableScreens = data.length;
  const columnSize = availableScreens > 0 ? 12 / availableScreens : 12;

  return (
    <>
      {availableScreens > 0 ? (
        <>
          <h2 className="text-center font-bold text-xl mb-2">
            {t("view_dashboard_screens_reproductions")}
          </h2>
          <Grid container spacing={2} wrap="nowrap">
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
        <p>
          No screens reproductions available at the moment. Please, try again
          later.
        </p>
      )}
    </>
  );
}

export default ReproductionsForScreen;
