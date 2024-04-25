/* eslint-disable react/prop-types */
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListIcon from "@mui/icons-material/List";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import SidebarItemLogout from "./SidebarItemLogout";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GetAppIcon from "@mui/icons-material/GetApp";
import CancelIcon from "@mui/icons-material/Cancel";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PaymentIcon from "@mui/icons-material/Payment";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTranslation } from "react-i18next";

function Sidebar({ handleDrawerToggle }) {
  const { t } = useTranslation();

  const [activeItem, setActiveItem] = useState(location.pathname);

  const user = useSelector((state) => state.auth.user);
  const handleItemClick = (itemId) => {
    localStorage.setItem("test", itemId);
    setActiveItem(itemId);
    handleDrawerToggle();
  };
  useEffect(() => {
    const pathname = location.pathname;
    setActiveItem(pathname);
  }, [location.pathname]);

  const menuItems = [
    {
      id: "/dashboard",
      translationKey: "menu_dashboard",
      name: "Dashboard",
      icon: <DashboardIcon />,
      subItems: null,
      allowEmployee: true,
    },

    {
      id: "/employees",
      translationKey: "menu_employees",
      name: "Employees",
      icon: <PeopleIcon />,
      allowEmployee: false,
      subItems: [
        {
          id: "/employees/create",
          translationKey: "menu_create",
          name: "Create",
          icon: <AddCircleOutlineIcon />,
          allowEmployee: false,
        },
        {
          id: "/employees/list",
          translationKey: "menu_list",
          name: "List",
          icon: <ListIcon />,
          allowEmployee: false,
        },
        {
          id: "/employees/transfer",
          translationKey: "menu_transfer",
          name: "Transfer",
          icon: <TransferWithinAStationIcon />,
          allowEmployee: false,
        },
      ],
    },
    {
      id: "/subscriptions",
      translationKey: "menu_membership",
      name: "Subscriptions",
      icon: <MonetizationOnIcon />,
      allowEmployee: false,
      subItems: [
        {
          id: "/subscriptions/get",
          translationKey: "menu_memberships_get",
          name: "Get",
          icon: <GetAppIcon />,
          allowEmployee: false,
        },
        {
          id: "/subscriptions/cancel",
          translationKey: "menu_memberships_cancel",
          name: "Cancel",
          icon: <CancelIcon />,
          allowEmployee: false,
        },
      ],
    },
    {
      id: "/screens",
      translationKey: "menu_screens",
      name: "Screens",
      icon: <ScreenShareIcon />,
      subItems: null,
      allowEmployee: false,
    },
    {
      id: "/rockobits",
      translationKey: "menu_rockobits",
      name: "Rockobits",
      icon: <AttachMoneyIcon />,
      allowEmployee: true,
      subItems: [
        {
          id: "/rockobits/buy",
          translationKey: "menu_buy",
          name: "Buy",
          icon: <ShoppingCartIcon />,
          allowEmployee: false,
        },
        {
          id: "/rockobits/sale",
          translationKey: "menu_sale",
          name: "Sale",
          icon: <MonetizationOnIcon />,
          allowEmployee: true,
        },
        {
          id: "/rockobits/qr",
          translationKey: "menu_qr",
          name: "QR Code",
          icon: <QrCode2Icon />,
          allowEmployee: true,
        },
      ],
    },
    {
      id: "/transactions",
      translationKey: "menu_transactions",
      name: "Transactions",
      icon: <PaymentIcon />,
      subItems: null,
    },
    {
      id: "/currentplays",
      translationKey: "menu_currentplays",
      name: "Current Plays",
      icon: <YouTubeIcon />,
      subItems: null,
      allowEmployee: true,
      enableCurrentPlaylist: user.enableCurrentPlaylist === true ? true : false,
    },
    {
      id: "help",
      translationKey: "menu_help",
      icon: <HelpOutlineIcon />,
      subItems: null,
    },
  ];

  return (
    <div className="bg-[#555CB3] overflow-y-auto h-full flex flex-col">
      <div className="flex flex-col mx-8 justify-center items-center space-x-2 my-4">
        <h2
          style={{ textShadow: "2px 2px 1px #B45946", color: "white" }}
          className="font-semibold text-white text-xl tracking-widest text-shadow-lg"
        >
          PSROCKOLA
        </h2>
        <h2
          style={{ textShadow: "2px 2px 1px #B45946", color: "white" }}
          className="font-semibold text-white text-xl tracking-widest text-shadow-lg"
        >
          {user.type === 23 ? t("psrockola_owner") : t("psrockola_employee")}
        </h2>
      </div>
      <Divider />
      <List>
        {menuItems
          .filter((item) => {
            //Si
            if (item.allowEmployee === false && user.type === 22) {
              return false;
            }

            // Si el usuario no es una empresa y el acceso no está permitido para empleados, redirige a Unauthorized
            if (
              item.enableCurrentPlaylist === false &&
              user.enableCurrentPlaylist === false
            ) {
              return false;
            }

            return true;
          })
          .map((item, index) => {
            // Renderizar el elemento normalmente si no se cumple la condición anterior
            return item.subItems ? (
              <SidebarItemCollapse
                item={item}
                key={index}
                handleDrawerToggle={handleDrawerToggle}
                handleItemClick={handleItemClick}
                activeItem={activeItem}
                t={t}
              />
            ) : (
              <SidebarItem
                item={item}
                key={index}
                handleDrawerToggle={handleDrawerToggle}
                handleItemClick={handleItemClick}
                activeItem={activeItem}
                t={t}
              />
            );
          })}
      </List>

      <div className="mt-auto mb-5">
        <SidebarItemLogout
          item={{
            id: "logout",
            translationKey: "menu_logout",
            icon: <LogoutIcon />,
            subItems: null,
          }}
        />
      </div>
    </div>
  );
}

export default Sidebar;
