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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ListSubcompanies() {
  const user = useSelector((state) => state.auth.user);
  const [subcompanies, setSubcompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false); // Estado para controlar la apertura del modal de edición
  const [selectedSubcompany, setSelectedSubcompany] = useState(null);
  const [editedSubcompany, setEditedSubcompany] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

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
  }, []);

  const handleEdit = (subcompany) => {
    setSelectedSubcompany(subcompany);
    setEditedSubcompany({
      name: subcompany.name,
      email: subcompany.email,
      phone: subcompany.phone,
      address: subcompany.address,
    });
    setEditModalOpen(true); // Abrir el modal de edición
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
    try {
      await api.patch(
        `/subcompany/${selectedSubcompany.id}`,
        editedSubcompany
      );
      // Actualizar la lista de subempresas después de la edición
      const response = await api.get("/subcompany/distributor/" + user.id);
      setSubcompanies(response.data);
      // Cerrar el modal después de editar
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating subcompany:", error);
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
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                }}
              >
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>{" "}
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
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(subcompany)}
                      sx={{ color: "#1976d2" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(subcompany.id)}
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
        onClose={() => handleCloseEditModal()} // Cerrar el modal al hacer clic fuera de él
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        {/* Contenido del modal */}
        <div className="w-96 bg-white p-4 mx-auto mt-24">
          <h2 id="edit-modal-title" className="text-2xl font-bold mb-4">
            Edit Subcompany
          </h2>

          {/* Campos de entrada para la edición */}
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
            {/* Botones para guardar cambios y cerrar el modal */}
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Save Changes
            </button>
            <button
              onClick={() => handleCloseEditModal()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
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
