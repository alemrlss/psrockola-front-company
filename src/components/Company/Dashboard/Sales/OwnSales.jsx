import { Card, CardContent, Typography, Avatar, Grid } from "@mui/material";

function OwnSales({ ownSales }) {
  return (
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent sx={{ backgroundColor: "#A3FBEB", textAlign: "center" }}>
          <Typography variant="h6">
            <b>{ownSales.totalSales}</b> Rockobits sold
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 18 }}>
            <b>{ownSales.countSales}</b> sales
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default OwnSales;
