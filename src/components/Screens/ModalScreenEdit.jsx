import { Modal, Box, TextField, Button, Tabs, Tab } from "@mui/material";
import { useState } from "react";

function ModalScreenEdit({
  editingScreen,
  setEditingScreen,
  editedScreenName,
  setEditedScreenName,
  editError,
  handleEditSave,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  handlePasswordSave,
  passwordError,
  setPasswordError,
}) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setPasswordError("");
    setSelectedTab(newValue);
  };

  return (
    <Modal
      open={!!editingScreen}
      onClose={() => {
        setEditingScreen(null);
        setEditedScreenName("");
        setCurrentPassword("");
        setNewPassword("");
        setPasswordError("");
      }}
      aria-labelledby="modal-edit-screen"
    >
      <Box className="p-4 bg-white w-96 mx-auto mt-20 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Edit Screen</h2>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Edit Name" />
          <Tab label="Edit Password" />
        </Tabs>
        {selectedTab === 0 && (
          <Box>
            <TextField
              label="New Name"
              variant="outlined"
              fullWidth
              value={editedScreenName}
              onChange={(e) => {
                setPasswordError("");
                setEditedScreenName(e.target.value);
              }}
              className="mb-2"
            />
            {editError && <p className="text-red-500 mt-2">{editError}</p>}
          </Box>
        )}
        {selectedTab === 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <TextField
              label="Current Password"
              variant="outlined"
              fullWidth
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordError("");
              }}
              className="mb-2"
            />
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-2"
            />{" "}
            {passwordError && (
              <p className="text-red-500 mt-2">{passwordError}</p>
            )}
          </Box>
        )}

        {selectedTab === 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePasswordSave}
            className="mt-4"
          >
            Save Password
          </Button>
        )}
        {selectedTab === 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditSave}
            className="mt-4"
          >
            Save Name
          </Button>
        )}
      </Box>
    </Modal>
  );
}

export default ModalScreenEdit;
