import { useEffect, useState } from "react";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import {
  Button,
  Container,
  Typography,
  Modal,
  Box,
  TextField,
  Switch,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoneyIcon from "@mui/icons-material/Money";
import { useDispatch } from "react-redux";
import { updateUserBalance } from "../../../features/authSlice";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { SwapHoriz } from "@mui/icons-material";
import ModalTransactionsEmployee from "../../../components/Employees/ModalTransactionsEmployees";
import ModalEditEmployee from "../../../components/Employees/Edit/ModalEditEmployee";

function ListEmployees() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [employees, setEmployees] = useState([]);
  const [limitEmployees, setLimitEmployees] = useState(0);

  const [editedEmployee, setEditedEmployee] = useState({
    id: "",
    name: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    balance: "",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionsModalOpen, setTransactionsModalOpen] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [employeeToTransactions, setEmployeeToTransactions] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoading(true);
        const response = await api.get(`employee/employees/${user.id}`);
        setEmployees(response.data.data.employees);
        setLimitEmployees(response.data.data.employeeLimit);
      } catch (error) {
        console.error("Error al obtener las membresías:", error);
      } finally {
        setLoading(false);
      }
    };

    getEmployees();
  }, [user.id]);

  // Funciones para abrir y cerrar el menú desplegable
  const handleMenuOpen = (event, employee) => {
    setSelectedEmployee(employee);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (employeeId) => {
    try {
      setLoading(true); // Establecer loading a true al comenzar la solicitud
      const response = await api.delete(`/employee/${employeeId.id}`);
      console.log("Empleado eliminado:", response.data);

      // Actualiza el estado de los empleados después de eliminar
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== employeeId.id)
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
    setEditedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
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

  const handleDeleteModalOpen = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setEmployeeToDelete(null);
    setError(null);
  };
  const handleTransactionsModalOpen = (employee) => {
    setEmployeeToTransactions(employee);
    setTransactionsModalOpen(true);
  };

  const handleTransactionsModalClose = () => {
    setTransactionsModalOpen(false);
    setEmployeeToTransactions(null);
    setError(null);
  };

  const handlePermissionChange = async (employeeId, checked) => {
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
        Employees: {employees.length}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          my: 1,
        }}
      >
        Limite: {limitEmployees}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: "gray",
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {" "}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Lastname
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Phone
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Address
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Wallet
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Playlist Permission
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  sx={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Avatar src={employee.picture} />{" "}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {employee.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {employee.lastName}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {employee.email}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {employee.phone}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {employee.address}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: employee.balance > 0 ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {employee.balance}
                  </TableCell>
                  <TableCell>
                    {/* Permiso de playlist */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Switch
                        checked={employee.enableCurrentPlaylist}
                        onChange={(event) =>
                          handlePermissionChange(
                            employee.id,
                            event.target.checked
                          )
                        }
                        disabled={loading} // Deshabilitar el switch mientras se está realizando una solicitud
                      />
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {/* Botón de acciones */}
                    <IconButton
                      aria-controls={`menu-${employee.id}`}
                      aria-haspopup="true"
                      onClick={(event) => handleMenuOpen(event, employee)}
                      disabled={loading}
                    >
                      <MoreVertIcon
                        sx={{
                          color: "black",
                        }}
                      />
                    </IconButton>
                    {/* Menú desplegable */}
                    <Menu
                      id={`menu-${employee.id}`}
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() => handleEditModalOpen(selectedEmployee)}
                      >
                        <EditIcon sx={{ marginRight: "8px", color: "blue" }} />{" "}
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDeleteModalOpen(selectedEmployee)}
                      >
                        <DeleteIcon sx={{ marginRight: "8px", color: "red" }} />{" "}
                        Delete
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleClaimRB(selectedEmployee.id)}
                      >
                        <MoneyIcon
                          sx={{ marginRight: "8px", color: "yellow" }}
                        />{" "}
                        Claim RB
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleTransactionsModalOpen(selectedEmployee);
                        }}
                      >
                        <SwapHoriz
                          sx={{ marginRight: "8px", color: "black" }}
                        />{" "}
                        Transactions
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalEditEmployee
        editModalOpen={editModalOpen}
        handleEditModalClose={handleEditModalClose}
        editedEmployee={editedEmployee}
        setEditedEmployee={setEditedEmployee}
        setEmployees={setEmployees}
      />

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
      <ModalTransactionsEmployee
        isModalOpen={transactionsModalOpen}
        handleCloseModal={handleTransactionsModalClose}
        selectedEmployee={employeeToTransactions}
      />
    </Container>
  );
}

export default ListEmployees;
