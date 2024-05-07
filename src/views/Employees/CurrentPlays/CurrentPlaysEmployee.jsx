import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Container,
  Typography,
  Box,
  Modal,
  Grid,
  Divider,
} from "@mui/material";
import api from "../../../api/api";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import msToTime from "../../../utils/formatMsToTime";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import RefreshIcon from "@mui/icons-material/Refresh";

function CurrentPlaysEmployee() {
  const [screens, setScreens] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [currentVideos, setCurrentVideos] = useState({});
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToBan, setVideoToBan] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      let userId;
      if (user.type === 22) {
        userId = user.companyId;
      } else {
        userId = user.id;
      }

      try {
        const response = await api.get(`/screen/company/${userId}`);
        setScreens(response.data.data.screens);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };

    fetchData();
  }, [user.id]);

  const handleShowScreen = async (screen) => {
    setCurrentScreen(screen);
    await currentPlayListData(screen);
  };

  const currentPlayListData = async (screen) => {
    try {
      const response = await api.get(`play-list-company/${screen.code}`);
      setCurrentVideos({ [screen.id]: response.data.data.videos });
      setSelectAll(false);
      setSelectedVideos([]);
    } catch (error) {
      console.error("Error fetching current playlist:", error);
    }
  };

  const handleBackButtonClick = () => {
    setCurrentScreen(null);
  };

  const handleCheckboxChange = (event, video) => {
    console.log(event.target.checked);
    if (event.target.checked) {
      setSelectedVideos([...selectedVideos, video]);
    } else {
      setSelectedVideos(selectedVideos.filter((v) => v.id !== video.id));
    }

    if (selectedVideos.length + 1 === currentVideos[currentScreen.id].length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const handleBanClick = (video) => {
    setVideoToBan(video);
    setIsModalOpen(true);
  };

  const confirmBanVideo = async (screen) => {
    setIsBanning(true); // Activar el estado de "baneando"
    try {
      await api.patch(`play-list-company/${videoToBan.id}`, {
        state: 3,
        idCompany: videoToBan.id_company,
        codeScreen: videoToBan.codeScreen,
      });

      const updatedVideos = currentVideos[currentScreen.id].filter(
        (video) => video.id !== videoToBan.id
      );
      setCurrentVideos({
        ...currentVideos,
        [currentScreen.id]: updatedVideos,
      });
      setIsModalOpen(false);
    } catch (error) {
      setIsModalOpen(false);
      currentPlayListData(currentScreen);

      console.error("Error banning video:", error);
    } finally {
      setIsBanning(false); // Desactivar el estado de "baneando" cuando termina
    }
  };

  const handleBanSelected = async () => {
    if (selectedVideos.length === 0) {
      alert("Please select at least one video to ban");
      return;
    }

    // Abrir el modal de confirmación
    setShowConfirmationModal(true);
  };

  const confirmBanSelected = async () => {
    setIsBanning(true); // Activar el estado de "baneando"
    try {
      // Baneando los videos seleccionados
      await Promise.all(
        selectedVideos.map(async (video) => {
          try {
            // Borrar el video
            await api.patch(`play-list-company/${video.id}`, {
              state: 3,
              idCompany: video.id_company,
              codeScreen: video.codeScreen,
            });
          } catch (error) {
            // Manejar el error si el video ya está completado
            if (
              error.response &&
              error.response.status === 400 &&
              error.response.data.message === "VIDEO_ALREADY_FINISHED"
            ) {
              console.log(
                `El video ${video.id} ya está completado, no se puede borrar.`
              );
              return; // Salir del bucle y no hacer nada con este video
            }
            // Si el error no es debido a que el video está completado, imprimir el error
            console.error("Error banning video:", error);
          }
        })
      );

      // Filtrando los videos baneados de la lista actual
      const updatedVideos = currentVideos[currentScreen.id].filter(
        (v) =>
          !selectedVideos.some((selectedVideo) => selectedVideo.id === v.id)
      );

      // Actualizando el estado con la nueva lista de videos
      setCurrentVideos({
        ...currentVideos,
        [currentScreen.id]: updatedVideos,
      });

      // Limpiando la lista de videos seleccionados y desactivando la selección de todos
      setSelectedVideos([]);
      setSelectAll(false);

      // Cerrar el modal de confirmación
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error banning videos:", error);
    } finally {
      setIsBanning(false); // Desactivar el estado de "baneando" cuando termina
    }
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedVideos(currentVideos[currentScreen.id]);
    } else {
      setSelectedVideos([]);
    }
  };
  function formatDateTime(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate();
    const monthNames = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Formatear los componentes de la fecha para que tengan dos dígitos
    const formattedDay = String(day).padStart(2, "0");
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedDay} ${monthName} ${year} - ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" className="text-center my-4 font-bold">
        Current Plays
      </Typography>
      {currentScreen ? (
        <div>
          <div className="flex space-x-2 mb-6 items-center">
            <IconButton
              onClick={handleBackButtonClick}
              sx={{
                color: "black",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" className="text-xl font-semibold mb-2">
              {currentScreen.code}
            </Typography>
            <IconButton
              onClick={() => {
                currentPlayListData(currentScreen);
              }}
              sx={{
                color: "#ACA6A6",
                width: "50px",
                height: "50px",
              }}
            >
              <RefreshIcon
                sx={{
                  width: "30px",
                  height: "30px",
                }}
              />
            </IconButton>
          </div>
          {currentVideos[currentScreen.id] && (
            <div>
              <div className="flex space-x-4 mb-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSelectAllChange}
                  className="mb-2"
                >
                  {selectAll ? `Deselect All` : `Select All `}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBanSelected}
                  className="mb-2"
                >
                  Ban Selected
                </Button>

                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "end",
                    margin: "auto",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  {selectedVideos.length} of{" "}
                  {currentVideos[currentScreen.id].length} selected
                </Typography>
              </div>
              <Grid container spacing={2}>
                {currentVideos[currentScreen.id].map((video) => (
                  <Grid item xs={12} key={video.id}>
                    <Box
                      className="p-4 border border-gray-300 rounded"
                      display="flex"
                      alignItems="center"
                      flexDirection={{ xs: "column", sm: "row" }}
                    >
                      <Checkbox
                        checked={selectedVideos.includes(video)}
                        onChange={(e) => handleCheckboxChange(e, video)}
                      />

                      <img
                        src={video.thumbnail}
                        alt="Thumbnail"
                        className="mb-1"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          marginLeft: { xs: 0, sm: 2 }, // Agregamos margen a la izquierda solo en dispositivos de escritorio
                          marginTop: { xs: 2, sm: 0 }, // Agregamos margen superior solo en dispositivos móviles
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={
                              video.typeModeplay === 1
                                ? "/modeplays/vip.png"
                                : video.typeModeplay === 2
                                ? "/modeplays/normal.png"
                                : "/modeplays/platinum.png"
                            }
                            alt="Emblem"
                            variant="rounded"
                            className="mb-1 mr-5"
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              alignSelf: "center",
                            }}
                          >
                            {video.title}
                          </Typography>
                        </div>
                        <Typography variant="body2">
                          {formatDateTime(video.createdAt)}
                        </Typography>
                        <Typography variant="body2">
                          {msToTime(video.duration)}
                        </Typography>
                        <Typography variant="body2">
                          {video.channelTitle}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleBanClick(video)}
                        sx={{ mt: { xs: 2, sm: 0 } }}
                      >
                        Ban
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              my: 1,
            }}
          >
            Screens
          </Typography>
          <Divider
            sx={{
              my: 2,
            }}
          />
          {screens.map((screen) => (
            <div
              key={screen.id}
              className="mb-4 p-2 border border-gray-300 flex justify-between items-center"
            >
              <Typography variant="h6">
                {screen.code} - {screen.name}{" "}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleShowScreen(screen)}
              >
                Show Playlist Screend
              </Button>
            </div>
          ))}
        </div>
      )}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {isBanning ? null : (
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to ban this video?
            </Typography>
          )}
          {isBanning ? ( // Si se está realizando la acción de "baneo", muestra un loader
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Typography
                  variant="body"
                  sx={{ fontWeight: "bold", fontSize: "30px" }}
                >
                  Banning video...
                </Typography>
              </Box>{" "}
            </Box>
          ) : (
            <>
              {videoToBan && (
                <div>
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2, fontWeight: "bold" }}
                  >
                    {videoToBan.title}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    Created At: {formatDateTime(videoToBan.createdAt)}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    Duration: {msToTime(videoToBan.duration)}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    Channel Title: {videoToBan.channelTitle}
                  </Typography>
                </div>
              )}
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={confirmBanVideo}
                  fullWidth
                >
                  Yes, I'm sure
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setIsModalOpen(false);
                    setVideoToBan(null);
                  }}
                  fullWidth
                >
                  No, cancel
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal de confirmación */}
      <Modal
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {isBanning ? null : (
            <Typography
              id="confirmation-modal-title"
              variant="h6"
              component="h2"
            >
              Are you sure you want to ban the selected videos?
            </Typography>
          )}
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {" "}
            {isBanning ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Typography
                  variant="body"
                  sx={{ fontWeight: "bold", fontSize: "30px" }}
                >
                  Banning videos...
                </Typography>
              </Box>
            ) : (
              selectedVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-gray-200 mt-2 p-2 rounded-lg overflow-y-auto"
                >
                  <Typography variant="h6">{video.title}</Typography>
                  <Typography>
                    Created At: {formatDateTime(video.createdAt)}
                  </Typography>
                  <Typography>Duration: {msToTime(video.duration)}</Typography>
                  <Typography>Channel Title: {video.channelTitle}</Typography>
                </div>
              ))
            )}
          </div>
          {isBanning ? null : (
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={confirmBanSelected}
                fullWidth
              >
                Yes, I'm sure
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowConfirmationModal(false)}
                fullWidth
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default CurrentPlaysEmployee;
