import { useState } from "react";
import {
  Modal,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
} from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ModalEditWithTabs({
  editModalOpen,
  handleCloseEditModal,
  editedSubcompany,
  handleInputChange,
  handleSaveChanges,
  loadingState,
  handleChangePassword,
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleTabChange = (event, newIndex) => {
    setErrorMessage(""); // Clear error message when changing tabs
    setTabIndex(newIndex);
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      handleChangePassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage(""); // Clear error message on success
    } else {
      setErrorMessage("Passwords do not match!");
    }
  };

  return (
    <Modal
      open={editModalOpen}
      onClose={handleCloseEditModal}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <div className="w-96 bg-white p-4 mx-auto mt-24">
        <h2 id="edit-modal-title" className="text-2xl font-bold mb-4">
          Edit Subcompany
        </h2>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Edit Info" {...a11yProps(0)} />
          <Tab label="Change Password" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <TextField
            label="Name"
            name="name"
            value={editedSubcompany.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={editedSubcompany.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={editedSubcompany.phone}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Address"
            name="address"
            value={editedSubcompany.address}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
              disabled={loadingState}
            >
              {loadingState ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={handleCloseEditModal}
              variant="contained"
              color="secondary"
              disabled={loadingState}
              sx={{ marginLeft: 2 }}
            >
              Close
            </Button>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              setErrorMessage("") // Clear error message when typing
            }}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setErrorMessage("") // Clear error message when typing
            }}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <div className="flex justify-end mt-4">
            <Button
              onClick={handlePasswordChange}
              variant="contained"
              color="primary"
              disabled={loadingState}
            >
              {loadingState ? "Saving..." : "Change Password"}
            </Button>
            <Button
              onClick={handleCloseEditModal}
              variant="contained"
              color="secondary"
              disabled={loadingState}
              sx={{ marginLeft: 2 }}
            >
              Close
            </Button>
          </div>
        </TabPanel>
      </div>
    </Modal>
  );
}

export default ModalEditWithTabs;
