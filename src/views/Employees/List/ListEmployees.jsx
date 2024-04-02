import { useEffect, useState } from "react";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import {
  Button,
  Container,
  Grid,
  Typography,
  Modal,
  Box,
  TextField,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoneyIcon from "@mui/icons-material/Money";
import { useDispatch } from "react-redux";
import { updateUserBalance } from "../../../features/authSlice";

function ListEmployees() {
  const [employees, setEmployees] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({
    id: "",
    name: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    balance: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Nuevo estado para el estado de carga

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoading(true); // Establecer loading a true al comenzar la solicitud
        const response = await api.get(`employee/employees/${user.id}`);
        setEmployees(response.data.data);
      } catch (error) {
        console.error("Error al obtener las membresías:", error);
      } finally {
        setLoading(false); // Establecer loading a false después de completar la solicitud
      }
    };

    getEmployees();
  }, [user.id]);

  const handleDelete = async (employeeId) => {
    try {
      setLoading(true); // Establecer loading a true al comenzar la solicitud
      const response = await api.delete(`/employee/${employeeId}`);
      console.log("Empleado eliminado:", response.data);

      // Actualiza el estado de los empleados después de eliminar
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== employeeId)
      );
      setDeleteModalOpen(false);
      setError(null);
    } catch (error) {
      console.log("Error al eliminar empleado:", error);

      if (error.response.data.message === "EMPLOYEE_HAVE_ROCKOBITS") {
        setError("Employee has Rockobits, can't be deleted");
      }
    } finally {
      setLoading(false); // Establecer loading a false después de completar la solicitud
    }
  };

  const handleEditModalOpen = (employee) => {
    console.log(employee);
    setEditedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEdit = async () => {
    try {
      setLoading(true); // Establecer loading a true al comenzar la solicitud
      // Realiza la solicitud PATCH al servidor para editar el empleado
      const response = await api.patch(`/employee/${editedEmployee.id}`, {
        name: editedEmployee.name,
        lastName: editedEmployee.lastName,
        phone: editedEmployee.phone,
        address: editedEmployee.address,
        email: editedEmployee.email,
      });

      // Actualiza el estado de los empleados con los datos editados
      setEmployees((prevEmployees) => {
        // Encuentra el índice del empleado editado en el array employees
        const index = prevEmployees.findIndex(
          (emp) => emp.id === editedEmployee.id
        );

        // Crea un nuevo objeto de empleado con los datos actualizados
        const updatedEmployee = {
          ...response.data.data,
          balance: editedEmployee.balance, // Mantén el balance existente
        };

        // Crea una nueva matriz de empleados con el empleado actualizado
        const updatedEmployees = [...prevEmployees];
        updatedEmployees[index] = updatedEmployee;
        return updatedEmployees;
      });

      console.log("Empleado editado:", response.data);
      setEditModalOpen(false); // Cierra el modal de edición después de editar
    } catch (error) {
      console.error("Error al editar empleado:", error);
    } finally {
      setLoading(false); // Establecer loading a false después de completar la solicitud
    }
  };

  const handleClaimRB = async (employeeId) => {
    try {
      setLoading(true); // Establecer loading a true al comenzar la solicitud
      const response = await api.get(
        `/employee/claim-rockobits-employee-to-company`,
        {
          params: {
            employeeId: employeeId,
            companyId: user.id,
            // Otros parámetros si es necesario
          },
        }
      );
      console.log("RB claimed:", response.data);

      const updatedEmployees = employees.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            balance: 0,
          };
        }
        return emp;
      });
      setEmployees(updatedEmployees);

      console.log(user.balance);
      console.log(response.data.data.employee.amount);
      dispatch(
        updateUserBalance(
          user.balance + parseInt(response.data.data.employee.amount)
        )
      );
    } catch (error) {
      console.error("Error al reclamar RB:", error);
    } finally {
      setLoading(false); // Establecer loading a false después de completar la solicitud
    }
  };

  const handleDeleteModalOpen = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setError(null);
  };

  const handlePermissionChange = async (employeeId, checked) => {
    console.log(`Cambiar permisos para el empleado ${employeeId}: ${checked}`);

    try {
      setLoading(true); // Establecer loading a true al comenzar la solicitud
      await api.patch(`/employee/${employeeId}/currentPlaylistPermission`, {
        enable: checked,
      });

      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) => {
          if (emp.id === employeeId) {
            return {
              ...emp,
              enableCurrentPlaylist: checked,
            };
          }
          return emp;
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Establecer loading a false después de completar la solicitud
    }
  };

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{
          my: 1,
        }}
      >
        Employees
      </Typography>
      {employees.map((employee) => (
        <Box
          key={employee.id}
          className="bg-gray-100 rounded-md p-4 mb-2 border-4 border-gray-200"
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Grid
            container
            spacing={2}
            className="flex justify-between items-center"
          >
            {/* Columna de datos */}
            <div className="flex justify-center items-center space-x-10 mx-6  px-2">
              <div>
                <Typography variant="subtitle1" className="font-bold">
                  ID: {employee.id}
                </Typography>
                <Typography variant="subtitle1" className="font-bold">
                  Name: {employee.name}
                </Typography>
                <Typography variant="subtitle1" className="font-bold">
                  Lastname: {employee.lastName}
                </Typography>
                <Typography variant="subtitle1" className="font-bold">
                  Email: {employee.email}
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle1" className="font-bold">
                  Phone: {employee.phone}
                </Typography>
                <Typography variant="subtitle1" className="font-bold">
                  Address: {employee.address}
                </Typography>
                <Typography variant="subtitle1" className="font-bold">
                  Wallet: {employee.balance}
                </Typography>
              </div>
            </div>

            <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => handleEditModalOpen(employee)}
                sx={{ mb: 1 }} // Agrega espacio en la parte inferior del botón
                disabled={loading} // Deshabilitar el botón mientras se está realizando una solicitud
              >
                Edit
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "#FFD400",
                    color: "#000",
                  },
                  mb: 1,
                }}
                startIcon={<MoneyIcon />}
                onClick={() => handleClaimRB(employee.id)}
                disabled={loading} // Deshabilitar el botón mientras se está realizando una solicitud
              >
                Claim RB
              </Button>{" "}
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteModalOpen(employee.id)}
                sx={{ mb: 1 }} // Agrega espacio en la parte inferior del botón
                disabled={loading} // Deshabilitar el botón mientras se está realizando una solicitud
              >
                Delete
              </Button>
              <Typography variant="subtitle1" className="font-bold">
                Playlist current permission:
              </Typography>
              <Switch
                checked={employee.enableCurrentPlaylist}
                onChange={(event) =>
                  handlePermissionChange(employee.id, event.target.checked)
                }
                disabled={loading} // Deshabilitar el switch mientras se está realizando una solicitud
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="edit-employee-modal"
        aria-describedby="edit-employee-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" id="modal-modal-title" component="h2">
            Edit employee
          </Typography>
          <Box
            component="form"
            sx={{ mt: 2 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit();
            }}
          >
            <TextField
              fullWidth
              id="name"
              label="Name"
              variant="outlined"
              value={editedEmployee.name}
              onChange={(e) =>
                setEditedEmployee({ ...editedEmployee, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="lastname"
              label="Lastname"
              variant="outlined"
              value={editedEmployee.lastName}
              onChange={(e) =>
                setEditedEmployee({
                  ...editedEmployee,
                  lastName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="phone"
              label="Phone"
              variant="outlined"
              value={editedEmployee.phone}
              onChange={(e) =>
                setEditedEmployee({ ...editedEmployee, phone: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="address"
              label="Address"
              variant="outlined"
              value={editedEmployee.address}
              onChange={(e) =>
                setEditedEmployee({
                  ...editedEmployee,
                  address: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="email"
              label="Email"
              variant="outlined"
              value={editedEmployee.email}
              onChange={(e) =>
                setEditedEmployee({
                  ...editedEmployee,
                  email: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <Button fullWidth variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        aria-labelledby="delete-employee-modal"
        aria-describedby="delete-employee-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" id="modal-modal-title" component="h2">
            Confirmation delete
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to delete this employee?{" "}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleDeleteModalClose}
              sx={{ mr: 2 }}
              disabled={loading} // Deshabilitar el botón mientras se está realizando una solicitud
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDelete(employeeToDelete);
              }}
              disabled={loading} // Deshabilitar el botón mientras se está realizando una solicitud
            >
              Delete
            </Button>
          </Box>
          {error && (
            <Typography variant="body1" sx={{ mt: 2, color: "red" }}>
              {error}
            </Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default ListEmployees;
