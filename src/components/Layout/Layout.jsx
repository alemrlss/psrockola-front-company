import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SidebarCompany from "../common/Sidebars/SidebarCompany/SidebarCompany";
import SidebarEmployee from "../common/Sidebars/SidebarEmployee/SidebarEmployee";
import SidebarDistributor from "../common/Sidebars/SidebarDistributor/SidebarDistributor";
import SidebarSubcompany from "../common/Sidebars/SidebarSubcompany/SidebarSubcompany";
import AppBarSubcompany from "../common/Appbars/AppbarSubcompany/AppbarSubcompany";
import AppBarDistributor from "../common/Appbars/AppbarDistributor/AppbarDistributor";
import AppBarCompany from "../common/Appbars/AppbarCompany/AppbarCompany";
import AppBarEmployee from "../common/Appbars/AppbarEmployee/AppbarEmployee";

const drawerWidth = 240;
function Layout(props) {
  const user = useSelector((state) => state.auth.user);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  let SidebarComponent;
  let AppbarComponent;

  //Renderizando sidebar y appbar segun el tipo de usuario(role)
  if (user.type === 23) {
    SidebarComponent = SidebarCompany;
  } else if (user.type === 22) {
    SidebarComponent = SidebarEmployee;
  } else if (user.type === 24) {
    SidebarComponent = SidebarSubcompany;
  } else if (user.type === 25) {
    SidebarComponent = SidebarDistributor;
  }

  if (user.type === 22) {
    AppbarComponent = AppBarEmployee;
  } else if (user.type === 23) {
    AppbarComponent = AppBarCompany;
  } else if (user.type === 24) {
    AppbarComponent = AppBarSubcompany;
  } else if (user.type === 25) {
    AppbarComponent = AppBarDistributor;
  }

  return (
    <Box sx={{ display: "flex", overflow: "auto" }}>
      <CssBaseline />
      <AppbarComponent
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          disableScrollLock={true}
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <SidebarComponent handleDrawerToggle={handleDrawerToggle} />
        </Drawer>
        <Drawer
          disableScrollLock={true}
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <SidebarComponent handleDrawerToggle={handleDrawerToggle} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
};

export default Layout;
