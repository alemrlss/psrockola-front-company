/* eslint-disable react/prop-types */
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { logout } from "../../features/authSlice";
import { useDispatch } from "react-redux";

function SidebarItemLogout({ item }) {

  const dispatch = useDispatch();
  return (
    <ListItemButton
      sx={{
        display: "flex",
        marginLeft: "30px",
        marginRight: "30px",
        "&:hover": {
          backgroundColor: "#8087DF",
          borderRadius: "60px",
        },
        "&:not(:hover)": {
          backgroundColor: "transparent",
          borderRadius: "40px",
        },
      }}
      onClick={() => {
        dispatch(logout());
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        className="space-x-4"
      >
        <ListItemIcon sx={{ color: "white", minWidth: 0 }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          sx={{ color: "white", ml: 0 }}
          primary={"Cerrar sesión"}
        />
      </Box>
    </ListItemButton>
  );
}

export default SidebarItemLogout;
