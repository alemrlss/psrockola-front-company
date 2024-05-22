import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "../../../api/api";
import msToTime from "../../../utils/formatMsToTime";

function ScreenSubcompany() {
  const user = useSelector((state) => state.auth.user);
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToBan, setVideoToBan] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isBanning, setIsBanning] = useState(false);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await api.get("/screen/subcompany/" + user.id);
        setScreens(response.data.data.screens);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };
    fetchScreens();
  }, [user.id]);

  const handleShowPlaylist = async (screen) => {
    setLoading(true);
    try {
      const response = await api.get(`/play-list-company/${screen.code}`);
      setPlaylist(response.data.data.videos);
      setSelectedScreen(screen);
      setSelectAll(false);
      setSelectedVideos([]);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedScreen(null);
    setPlaylist([]);
  };

  const handleCheckboxChange = (event, video) => {
    if (event.target.checked) {
      setSelectedVideos([...selectedVideos, video]);
    } else {
      setSelectedVideos(selectedVideos.filter((v) => v.id !== video.id));
    }

    setSelectAll(
      selectedVideos.length + 1 === playlist.length && event.target.checked
    );
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedVideos(playlist);
    } else {
      setSelectedVideos([]);
    }
  };

  const handleBanClick = (video) => {
    setVideoToBan(video);
    setIsModalOpen(true);
  };

  const confirmBanVideo = async () => {
    setIsBanning(true);
    try {
      await api.patch(`play-list-company/${videoToBan.id}`, {
        state: 3,
        idCompany: videoToBan.id_company,
        codeScreen: videoToBan.codeScreen,
      });
      const updatedPlaylist = playlist.filter(
        (video) => video.id !== videoToBan.id
      );
      setPlaylist(updatedPlaylist);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error banning video:", error);
    } finally {
      setIsBanning(false);
    }
  };

  const handleBanSelected = async () => {
    if (selectedVideos.length === 0) {
      alert("Please select at least one video to ban");
      return;
    }
    setShowConfirmationModal(true);
  };

  const confirmBanSelected = async () => {
    setIsBanning(true);
    try {
      await Promise.all(
        selectedVideos.map(async (video) => {
          try {
            await api.patch(`play-list-company/${video.id}`, {
              state: 3,
              idCompany: video.id_company,
              codeScreen: video.codeScreen,
            });
          } catch (error) {
            if (
              error.response &&
              error.response.status === 400 &&
              error.response.data.message === "VIDEO_ALREADY_FINISHED"
            ) {
              console.log(`El video ${video.id} ya está completado.`);
              return;
            }
            console.error("Error banning video:", error);
          }
        })
      );
      const updatedPlaylist = playlist.filter(
        (v) => !selectedVideos.some((selectedVideo) => selectedVideo.id === v.id)
      );
      setPlaylist(updatedPlaylist);
      setSelectedVideos([]);
      setSelectAll(false);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error banning videos:", error);
    } finally {
      setIsBanning(false);
    }
  };

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "ene", "feb", "mar", "abr", "may", "jun",
      "jul", "ago", "sep", "oct", "nov", "dic"
    ];
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day} ${monthName} ${year} - ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Container maxWidth="lg">
      {!selectedScreen ? (
        <>
          <Typography variant="h4" className="text-center my-4 font-bold">
            Screens
          </Typography>
          <Divider sx={{ my: 2 }} />
          {screens.length > 0 ? (
            screens.map((screen) => (
              <div
                key={screen.id}
                className="mb-4 p-2 border border-gray-300 bg-gray-200 flex justify-between items-center"
              >
                <Typography variant="h6">
                  {screen.name} - <b>{screen.code}</b>
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleShowPlaylist(screen)}
                >
                  Show Playlist
                </Button>
              </div>
            ))
          ) : (
            <p>Cargando pantallas...</p>
          )}
        </>
      ) : (
        <>
          <div className="flex space-x-2 mb-6 items-center">
            <IconButton onClick={handleBack} sx={{ color: "black" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" className="text-xl font-semibold mb-2">
              {selectedScreen.code}
            </Typography>
            <IconButton
              onClick={() => handleShowPlaylist(selectedScreen)}
              sx={{ color: "#ACA6A6", width: "50px", height: "50px" }}
            >
              <RefreshIcon sx={{ width: "30px", height: "30px" }} />
            </IconButton>
          </div>
          <div className="flex space-x-4 mb-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSelectAllChange}
              className="mb-2"
            >
              {selectAll ? "Deselect All" : "Select All"}
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
              {selectedVideos.length} of {playlist.length} selected
            </Typography>
          </div>
          <Grid container spacing={2}>
            {playlist.length > 0 ? (
              playlist.map((video) => (
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
              ))
            ) : loading ? (
              <p>Loading playlist...</p>
            ) : (
              <p>No videos available</p>
            )}
          </Grid>
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
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
        </>
      )}
    </Container>
  );
}

export default ScreenSubcompany;
