/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useSelector } from "react-redux";
import { formatExpirationDate } from "../../utils/formatDate";
import { formatNumbers } from "../../utils/formatNumbers";
import ModalEditUser from "./ModalEditUser";
import LanguageSwitcher from "../LanguageSwitcher";

function AppBarComponent({ drawerWidth, handleDrawerToggle }) {
  const user = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const getMembershipType = (type) => {
    switch (type) {
      case 10:
        return { name: "Basic", icon: <StarIcon />, color: "#A4A1A1" };
      case 20:
        return { name: "Vip", icon: <EmojiEventsIcon />, color: "#1294BF" };
      case 30:
        return {
          name: "Premium",
          icon: <WorkspacePremiumIcon />,
          color: "#DEBB03",
        };
      default:
        return { name: "Unknown", icon: <HelpOutlineIcon />, color: "#555CB3" };
    }
  };

  const getTextColor = () => {
    if (user.membership && user.membership.expiration) {
      const daysUntilExpiration = calculateDaysUntilExpiration(
        user.membership.expiration
      );
      if (daysUntilExpiration <= 10) {
        return "#F84C4C";
      }
    }
    return "#EFF9F8";
  };

  const calculateDaysUntilExpiration = (expirationDate) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Milisegundos por día

    // Calcula la diferencia en días y redondea hacia abajo.
    const daysUntilExpiration = Math.floor(
      (expiration - today) / millisecondsPerDay
    );

    return daysUntilExpiration;
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: "white",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: "none" },
            color: "black",
            borderRadius: "50px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {user.membership && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
                color: "black",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: getMembershipType(user.membership.type).color,
                  color: getTextColor(),
                }}
              >
                {getMembershipType(user.membership.type).icon}
              </Avatar>

              <Typography
                variant="body2"
                sx={{
                  bgcolor: getMembershipType(user.membership.type).color,
                  padding: "6px",
                  paddingX: "10px",
                  ml: "2px",
                  color: getTextColor(),
                  fontWeight: "bold",
                  fontStyle: "italic",
                  borderRadius: "50px",
                }}
              >
                {user.membership.expiration
                  ? `Expire ${formatExpirationDate(user.membership.expiration)}`
                  : "No membership"}
              </Typography>
            </Box>
          )}

          {user.balance !== undefined && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#555CB3",
                color: "black",
                padding: "6px",
                paddingX: "10px",
                boxShadow: "0px 6px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "20px",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Wallet: {formatNumbers(user.balance)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                marginX: { xs: "0px", sm: "10px" },
              }}
            >
              <LanguageSwitcher />
            </Box>

            <Box
              sx={{
                mr: 1,
                textAlign: "right",
                cursor: "pointer",
              }}
            >
              <Typography
                variant="caption"
                component="div"
                sx={{ color: "black" }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="body2"
                component="div"
                color="textSecondary"
                sx={{
                  fontStyle: "italic",
                  fontSize: "10px",
                }}
              >
                {user.type === 22
                  ? "Employee"
                  : user.type === 23
                  ? "Company"
                  : "No Role"}
              </Typography>
            </Box>

            <Avatar
              alt="Andy Avatar"
              src={user.photo}
              sx={{ width: 32, height: 32, cursor: "pointer" }}
              onClick={handleOpenModal}
            />
          </Box>
        </Box>
      </Toolbar>

      {/* Modal para las configuraciones del usuario */}
      <ModalEditUser
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        user={user}
      />
    </AppBar>
  );
}

export default AppBarComponent;
