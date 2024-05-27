import { Card, CardContent, Typography, Avatar, Grid } from "@mui/material";

function SalesForEmployee({ salesForEmployee }) {
  const maxSlots = 5;
  const numEmployees = Math.min(salesForEmployee.length, maxSlots);

  // Calcular las tarjetas para los empleados disponibles
  const employeesToShow = salesForEmployee
    .slice(0, numEmployees)
    .map((employee, index) => (
      <Grid item xs={12 / maxSlots} key={index}>
        <Card sx={{ borderRadius: "10px", height: "100%" }}>
          <CardContent sx={{ textAlign: "left" }}>
            <Avatar
              src={employee.employee.picture}
              alt={employee.employee.name}
              sx={{ width: "50px", height: "50px", marginBottom: "16px" }}
            />
            <Typography variant="h6">{employee.employee.name}</Typography>
            <Typography>Count Sales: {employee.countSales}</Typography>
            <Typography>Total Sales: {employee.totalSales}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ));

  // Rellenar con "No slot available" si hay menos de 5 empleados
  const emptySlots = maxSlots - numEmployees;
  const slotsToShow = Array.from({ length: emptySlots }, (_, index) => (
    <Grid item xs={12 / maxSlots} key={index + numEmployees}>
      <Card
        sx={{
          borderRadius: "10px",
          height: "100%",
          backgroundColor: "#f0f0f0",
          borderColor: "#e0e0e0",
          borderWidth: "2px",
          borderStyle: "dashed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#9e9e9e" }}>
            No Slot available
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ));

  return (
    <Grid container spacing={2}>
      {employeesToShow}
      {slotsToShow}
    </Grid>
  );
}

export default SalesForEmployee;
