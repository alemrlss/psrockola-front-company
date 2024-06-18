/* eslint-disable react/prop-types */
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
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
import { useEffect, useState } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import CancelIcon from "@mui/icons-material/Cancel";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PaymentIcon from "@mui/icons-material/Payment";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useTranslation } from "react-i18next";
import SidebarItem from "./SidebarItem";
import SidebarCollapse from "./SidebarCollapse";
import SidebarItemLogout from "./SidebarItemLogout";

function SidebarCompany({ handleDrawerToggle }) {
  const { t } = useTranslation();


  const [activeItem, setActiveItem] = useState(location.pathname);

  const handleItemClick = (itemId) => {
    localStorage.setItem("itemId", itemId);
    setActiveItem(itemId);
    handleDrawerToggle();
  };
  useEffect(() => {
    const pathname = location.pathname;
    setActiveItem(pathname);
  }, [location.pathname]);

  const menuItems = [
    {
      id: "/companies/dashboard",
      translationKey: "menu_dashboard",
      name: "Dashbdoard",
      icon: <DashboardIcon />,
      subItems: null,
    },
    {
      id: "/companies/employees",
      translationKey: "menu_employees",
      name: "Employees",
      icon: <PeopleIcon />,
      subItems: [
        {
          id: "/companies/employees/create",
          translationKey: "menu_create",
          name: "Create",
          icon: <AddCircleOutlineIcon />,
        },
        {
          id: "/companies/employees/list",
          translationKey: "menu_list",
          name: "List",
          icon: <ListIcon />,
        },
        {
          id: "/companies/employees/transfer",
          translationKey: "menu_transfer",
          name: "Transfer",
          icon: <TransferWithinAStationIcon />,
        },
      ],
    },
    {
      id: "/companies/subscriptions",
      translationKey: "menu_membership",
      name: "Subscriptions",
      icon: <MonetizationOnIcon />,
      subItems: [
        {
          id: "/companies/subscriptions/get",
          translationKey: "menu_memberships_get",
          name: "Get",
          icon: <GetAppIcon />,
        },
        {
          id: "/companies/subscriptions/cancel",
          translationKey: "menu_memberships_cancel",
          name: "Cancel",
          icon: <CancelIcon />,
        },
      ],
    },
    {
      id: "/companies/screens",
      translationKey: "menu_screens",
      name: "Screens",
      icon: <ScreenShareIcon />,
      subItems: null,
    },
    {
      id: "/companies/rockobits",
      translationKey: "menu_rockobits",
      name: "Rockobits",
      icon: <AttachMoneyIcon />,
      subItems: [
        {
          id: "/companies/rockobits/buy",
          translationKey: "menu_buy",
          name: "Buy",
          icon: <ShoppingCartIcon />,
        },
        {
          id: "/companies/rockobits/sale",
          translationKey: "menu_sale",
          name: "Sale",
          icon: <MonetizationOnIcon />,
        },
        {
          id: "/companies/rockobits/qr",
          translationKey: "menu_qr",
          name: "QR Code",
          icon: <QrCode2Icon />,
        },
      ],
    },
    {
      id: "/companies/transactions",
      translationKey: "menu_transactions",
      name: "Transactions",
      icon: <PaymentIcon />,
      subItems: null,
    },
    {
      id: "/companies/currentplays",
      translationKey: "menu_currentplays",
      name: "Current Plays",
      icon: <YouTubeIcon />,
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
          {t("psrockola_owner")}{" "}
        </h2>
      </div>
      <Divider />
      <List>
        {menuItems.map((item, index) => {
          // Renderizar el elemento normalmente si no se cumple la condición anterior
          return item.subItems ? (
            <SidebarCollapse
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

export default SidebarCompany;
