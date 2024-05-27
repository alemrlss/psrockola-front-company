import { Card, CardContent, Typography } from "@mui/material";

function ReproductionsCard({ screen, reproductions }) {
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
          Reproductions: <b>{reproductions}</b>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ReproductionsCard;
