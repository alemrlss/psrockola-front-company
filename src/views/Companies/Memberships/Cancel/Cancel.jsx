import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import getBenefits from "../../../../utils/getBenefits";
import api from "../../../../api/api";
import { useSelector, useDispatch } from "react-redux";
import { updateUserMembership } from "../../../../features/authSlice";
import { useTranslation } from "react-i18next";

function Cancel() {
  const token = useSelector((state) => state.auth.token);
  const { t } = useTranslation();

  const [membership, setMembership] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const userFound = await api.get(`/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembership(userFound.data.data.activeMembership);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMembership();
  }, []);

  const handleCancelConfirmation = () => {
    const cancelMembership = async () => {
      try {
        const response = await api.post(
          `/membership/cancel-subscription/${user.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setMembership(null);
        setShowConfirmationModal(false);

        dispatch(
          updateUserMembership({
            name: null,
            type: null,
            expiration: null,
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    cancelMembership();
  };

  return (
    <div className="flex items-center flex-col justify-center">
      <div className="bg-blue-200 p-8 rounded-lg shadow-md text-center mb-4">
        {membership && (
          <div>
            <p className="text-2xl font-semibold mb-4">
              {t("view_memberships_cancel_title")}{" "}
            </p>
            <p className="text-gray-600">{membership.name}</p>
            <p className="text-gray-600">
              {t("view_memberships_cancel_type")} {getBenefits(membership).type}
            </p>
            <p className="text-gray-600">
              {" "}
              {t("view_memberships_cancel_benefits")}{" "}
            </p>
            <p className="text-gray-600">
              {t("view_memberships_cancel_devices")}{" "}
              {getBenefits(membership).sales}
            </p>
            <p className="text-gray-600">
              {" "}
              Skins: {getBenefits(membership).skins}
            </p>
            <p className="text-gray-600">
              {t("view_memberships_cancel_modeplays")}{" "}
              {getBenefits(membership).customModePlay ? "Si" : "No"}
            </p>
          </div>
        )}
      </div>
      {membership && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowConfirmationModal(true)}
          >
            {t("view_memberships_cancel_btn_cancel")}
          </Button>
          <Modal
            open={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
          >
            <Box
              sx={{
                position: "absolute",
                width: 400,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" component="div">
                {t("view_memberships_cancel_modal_description")}
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelConfirmation}
                sx={{ m: 1 }}
              >
                {t("view_memberships_cancel_modal_btn_confirm")}
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowConfirmationModal(false)}
                sx={{ m: 1 }}
              >
                {t("view_memberships_cancel_modal_btn_cancel")}
              </Button>
            </Box>
          </Modal>
        </>
      )}

      {!membership && (
        <div>
          <h2 className="text-red-400 text-6xl">
            {t("view_memberships_cancel_no_membershio")}
          </h2>
        </div>
      )}
    </div>
  );
}

export default Cancel;
