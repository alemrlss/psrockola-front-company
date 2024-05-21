import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../../api/api";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import getBenefitsDistributorMembership from "../../../../utils/getBenefitsDistributorMembership";

function CreateSubcompanies() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    postalCode: "",
    distributorId: user.id, // Asignando distributorId fijo por ahora
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setMessage(null);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/subcompany", formData);
      setMessage({
        type: "success",
        content: "SubCompany created successfully",
      });
      // Limpiar el formulario después de enviar
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        postalCode: "",
        distributorId: 6,
      });
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message === "DISTRIBUTOR_MAX_ACCOUNTS_REACHED") {
        setMessage({
          type: "error",
          content: "You have reached the maximum number of accounts",
        });
      } else {
        setMessage({ type: "error", content: "Failed to create SubCompany" });
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="mx-auto max-w-lg  text-center text-2xl mb-4">
        You have a limit of{" "}
        <b>{getBenefitsDistributorMembership(user.membership.type).accounts}</b>{" "}
        Accounts
      </h2>
      <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create SubCompany{" "}
        </h2>

        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <TextField
            label={"Name"}
            name="name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label={"Email"}
            name="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label={"Password"}
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />

          <TextField
            label={"Address"}
            name="address"
            variant="outlined"
            fullWidth
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            label={"Phone"}
            name="phone"
            variant="outlined"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            label={"Postal Code"}
            name="postalCode"
            variant="outlined"
            fullWidth
            value={formData.postalCode}
            onChange={handleChange}
          />

          <div className="col-span-2 flex justify-center">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex">
                  <CircularProgress size={24} color="inherit" />
                  <span className="ml-2">
                    {t("view_employees_create_loading")}
                  </span>
                </div>
              ) : (
                t("view_employees_create_button")
              )}
            </Button>
          </div>
        </form>
        {message && (
          <div
            className={`${
              message.type === "success" ? "text-green-600" : "text-red-600"
            } p-2 mt-2 rounded font-bold`}
          >
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateSubcompanies;
