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
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalEditWithTabs from "../../../../components/Distributors/Subcompanies/List/ModalEdit";

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

  const [previewImage, setPreviewImage] = useState(null);
  const [photoFile, setPhotoFile] = useState(null); // Almacena el archivo de foto seleccionado

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
      id: subcompany.id,
      name: subcompany.name,
      email: subcompany.email,
      phone: subcompany.phone,
      address: subcompany.address,
      logo: subcompany.logo,
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedSubcompany(null);
    setEditedSubcompany({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setPreviewImage(null);
    setPhotoFile(null);
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

  const handleChangePassword = async (newPassword) => {
    setLoadingState(true); // Mostrar loading
    try {
      await api.patch(`/subcompany/change-password/${selectedSubcompany.id}`, {
        password: newPassword,
      });
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error changing password:", error);
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

      <ModalEditWithTabs
        editModalOpen={editModalOpen}
        handleCloseEditModal={handleCloseEditModal}
        editedSubcompany={editedSubcompany}
        handleInputChange={handleInputChange}
        handleSaveChanges={handleSaveChanges}
        loadingState={loadingState}
        handleChangePassword={handleChangePassword}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
        photoFile={photoFile}
        setPhotoFile={setPhotoFile}
        setSubcompanies={setSubcompanies}
      />
    </div>
  );
}

export default ListSubcompanies;
