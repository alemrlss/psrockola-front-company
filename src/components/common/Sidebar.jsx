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

function Sidebar({ handleDrawerToggle }) {
  const [activeItem, setActiveItem] = useState(
    localStorage.getItem("test") || "/dashboard"
  );
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
      translationKey: "menu_help",
      name: "Subscriptions",
      icon: <MonetizationOnIcon />,
      allowEmployee: false,
      subItems: [
        {
          id: "/subscriptions/get",
          translationKey: "menu_companies",
          name: "Get",
          icon: <GetAppIcon />,
          allowEmployee: false,
        },
        {
          id: "/subscriptions/cancel",
          translationKey: "menu_clients",
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
      ],
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
          {user.type === 23 ? "Owner" : "Employee"}
        </h2>
      </div>
      <Divider />
      <List>
        {menuItems
          .filter((item) => {
            // Si el usuario es de tipo 22 (empleado), filtra los items que permiten empleados
            if (user.type === 22) {
              return item.allowEmployee !== false;
            }
            // Si el usuario no es de tipo 22, no aplica ningún filtro
            return true;
          })
          .map((item, index) =>
            item.subItems ? (
              <SidebarItemCollapse
                item={item}
                key={index}
                handleDrawerToggle={handleDrawerToggle}
                handleItemClick={handleItemClick}
                activeItem={activeItem}
              />
            ) : (
              <SidebarItem
                item={item}
                key={index}
                handleDrawerToggle={handleDrawerToggle}
                handleItemClick={handleItemClick}
                activeItem={activeItem}
              />
            )
          )}
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
