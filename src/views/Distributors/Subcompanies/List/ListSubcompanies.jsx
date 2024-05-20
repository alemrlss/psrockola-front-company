import { useState, useEffect } from "react";
import api from "../../../../api/api";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Modal,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ListSubcompanies() {
  const user = useSelector((state) => state.auth.user);
  const [subcompanies, setSubcompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubcompany, setSelectedSubcompany] = useState(null);
  const [editedSubcompany, setEditedSubcompany] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loadingState, setLoadingState] = useState(false); // Nuevo estado de loading

  useEffect(() => {
    const fetchSubcompanies = async () => {
      try {
        const response = await api.get("/subcompany/distributor/" + user.id);
        setSubcompanies(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subcompanies:", error);
        setLoading(false);
      }
    };

    fetchSubcompanies();
  }, [user.id]);

  const handleEdit = (subcompany) => {
    setSelectedSubcompany(subcompany);
    setEditedSubcompany({
      name: subcompany.name,
      email: subcompany.email,
      phone: subcompany.phone,
      address: subcompany.address,
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedSubcompany(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSubcompany({
      ...editedSubcompany,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    setLoadingState(true); // Mostrar loading
    try {
      await api.patch(`/subcompany/${selectedSubcompany.id}`, editedSubcompany);
      const response = await api.get("/subcompany/distributor/" + user.id);
      setSubcompanies(response.data);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating subcompany:", error);
    } finally {
      setLoadingState(false); // Ocultar loading
    }
  };

  const handleStateChange = async (subcompany, newState) => {
    setLoadingState(true); // Mostrar loading
    try {
      await api.patch(`/subcompany/change-state/${subcompany.id}`, {
        state: newState,
      });

      const updatedSubcompanies = subcompanies.map((s) => {
        if (s.id === subcompany.id) {
          return {
            ...s,
            state_User: newState,
          };
        }
        return s;
      });

      setSubcompanies(updatedSubcompanies);
    } catch (error) {
      console.error("Error updating subcompany state:", error);
    } finally {
      setLoadingState(false); // Ocultar loading
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Subcompanies</h2>
      {subcompanies.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subcompanies.map((subcompany) => (
                <TableRow key={subcompany.id}>
                  <TableCell>
                    <Avatar alt={subcompany.name} src={subcompany.logo} />
                  </TableCell>
                  <TableCell>{subcompany.name}</TableCell>
                  <TableCell>{subcompany.email}</TableCell>
                  <TableCell>{subcompany.address}</TableCell>
                  <TableCell>{subcompany.phone}</TableCell>
                  <TableCell>
                    <Select
                      value={subcompany.state_User}
                      onChange={(e) =>
                        handleStateChange(subcompany, e.target.value)
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      disabled={loadingState} // Deshabilitar el select si está cargando
                    >
                      <MenuItem value={0}>Desactivado</MenuItem>
                      <MenuItem value={1}>Activo</MenuItem>
                      <MenuItem value={2}>Baneado</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(subcompany)}
                      sx={{ color: "#1976d2" }}
                      disabled={loadingState} // Deshabilitar el botón si está cargando
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      // onClick={() => handleDelete(subcompany.id)}
                      disabled={loadingState} // Deshabilitar el botón si está cargando
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>No subcompanies found.</div>
      )}

      {/* Modal de edición */}
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
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
              disabled={loadingState} // Deshabilitar el botón si está cargando
            >
              {loadingState ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCloseEditModal}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              disabled={loadingState} // Deshabilitar el botón si está cargando
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ListSubcompanies;
