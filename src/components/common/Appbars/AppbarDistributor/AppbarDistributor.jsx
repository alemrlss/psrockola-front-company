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
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./../../../LanguageSwitcher";
import { formatExpirationDate } from "../../../../utils/formatDate";
import { formatNumbers } from "../../../../utils/formatNumbers";
import getBenefitsDistributorMembership from "../../../../utils/getBenefitsDistributorMembership";
import ModalDistributorEdit from "../AppbarDistributor/ModalEditDistributor";

function AppBarDistributor({ drawerWidth, handleDrawerToggle }) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
          {user.balance !== undefined && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "20px",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "black",
                  fontSize: "1.6rem",
                }}
              >
                {formatNumbers(user.balance)}
              </Typography>
              <Avatar
                src="/rockobit.png"
                sx={{
                  width: 30,
                  height: 30,
                  marginLeft: 1,
                  backgroundColor: "transparent",
                  color: "black",
                }}
              />
            </Box>
          )}

          {user.membership && user.type === 25 && (
            <Box
              sx={{
                display: { xs: "flex", sm: "flex" },
                alignItems: "center",
                borderRadius: "50px",
                color: "black",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  bgcolor: "#555CB3",
                  padding: "2px",
                  paddingX: "6px",
                  ml: "2px",
                  mr: "2px",
                  color: "white",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  borderRadius: { xs: "0px", sm: "20px" },
                  fontSize: { xs: "10px", sm: "inherit" }, // Ajustar tamaño de texto
                }}
              >
                {user.membership.expiration
                  ? `${t("psrockola_appbar_expire")} ${formatExpirationDate(
                      user.membership.expiration
                    )} - Accounts: ${
                      getBenefitsDistributorMembership(user.membership.type)
                        .accounts
                    }`
                  : "No membership"}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                marginX: { xs: "0px", sm: "10px" },
              }}
            >
              <LanguageSwitcher />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
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
                  sx={{
                    color: "black",
                    fontSize: "12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "80px", // Ajusta esto según el tamaño que necesites
                  }}
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
                  {t("psrockola_appbar_role_distributor")}
                </Typography>
              </Box>

              <Avatar
                alt="Andy Avatar"
                src={user.photo}
                sx={{ width: 40, height: 40, cursor: "pointer" }}
                onClick={handleOpenModal}
              />
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {/* Modal para las configuraciones del usuario */}
      <ModalDistributorEdit
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        user={user}
      />
    </AppBar>
  );
}

export default AppBarDistributor;
