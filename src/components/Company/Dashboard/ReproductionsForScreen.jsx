import { Grid, Typography } from "@mui/material";
import ReproductionsCard from "./ReproductionsCard";

function ReproductionsForScreen({ data }) {
  const availableScreens = data.length;
  const emptySlots = 5 - availableScreens;
  const columnSize = availableScreens > 0 ? 12 / availableScreens : 12;

  const emptyCardStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    padding: "16px",
    color: "#9e9e9e",
    boxSizing: "border-box",
  };

  return (
    <>
      <h2 className="text-center font-bold text-xl mb-2">
        Screens Reproductions
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
        {[...Array(emptySlots)].map((_, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={columnSize}
            key={index + availableScreens}
          >
            <div style={emptyCardStyle}>
              <Typography variant="body2">No Slot Available</Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ReproductionsForScreen;
