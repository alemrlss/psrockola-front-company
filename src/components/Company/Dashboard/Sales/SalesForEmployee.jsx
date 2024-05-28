import { Card, CardContent, Typography, Avatar, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

function SalesForEmployee({ salesForEmployee }) {
  const { t } = useTranslation();
  const maxSlots = 2; // Número máximo de tarjetas por fila en dispositivos móviles
  const numEmployees = Math.min(salesForEmployee.length, maxSlots);

  // Calcular las tarjetas para los empleados disponibles
  const employeesToShow = salesForEmployee
    .slice(0, numEmployees)
    .map((employee, index) => (
      <Grid item xs={12} sm={6} key={index}>
        <Card sx={{ borderRadius: "10px", height: "100%" }}>
          <CardContent sx={{ textAlign: "left" }}>
            <Avatar
              src={employee.employee.picture}
              alt={employee.employee.name}
              sx={{ width: "50px", height: "50px", marginBottom: "16px" }}
            />
            <Typography variant="h6">{employee.employee.name}</Typography>
            <Typography>
              {t("view_dashboard_count_sales")}: {employee.countSales}
            </Typography>
            <Typography>
              {t("view_dashboard_total_sales")}: {employee.totalSales}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));

  return (
    <Grid container spacing={2}>
      {employeesToShow}
    </Grid>
  );
}

export default SalesForEmployee;
