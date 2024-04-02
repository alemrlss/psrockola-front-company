import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Container,
  Typography,
  Box,
  Modal,
  Grid,
} from "@mui/material";
import api from "../../api/api";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatExpirationDate } from "../../utils/formatDate";

function CurrentPlays() {
  const [screens, setScreens] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [currentVideos, setCurrentVideos] = useState({});
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToBan, setVideoToBan] = useState(null);
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
        setScreens(response.data.data);
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
    } catch (error) {
      console.error("Error fetching current playlist:", error);
    }
  };

  const handleBackButtonClick = () => {
    setCurrentScreen(null);
  };

  const handleCheckboxChange = (event, video) => {
    if (event.target.checked) {
      setSelectedVideos([...selectedVideos, video]);
    } else {
      setSelectedVideos(selectedVideos.filter((id) => id !== video));
    }
  };

  const handleBanClick = (video) => {
    setVideoToBan(video);
    setIsModalOpen(true);
  };

  const confirmBanVideo = async () => {
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
      console.error("Error banning video:", error);
    }
  };
  const handleBanSelected = async () => {
    if (selectedVideos.length === 0) {
      alert("Please select at least one video to ban");
    }

    try {
      // Baneando los videos seleccionados
      await Promise.all(
        selectedVideos.map(async (video) => {
          await api.patch(`play-list-company/${video.id}`, {
            state: 3,
            idCompany: video.id_company,
            codeScreen: video.codeScreen,
          });
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
    } catch (error) {
      console.error("Error banning videos:", error);
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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" className="text-center my-4 font-bold">
        Current Plays
      </Typography>
      {currentScreen ? (
        <div>
          <div className="flex space-x-2 mb-6">
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
                  {selectAll ? `Deselect All` : `Select All `}{" "}
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
                        checked={selectAll || selectedVideos.includes(video)}
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
                        <Typography variant="h6">{video.title}</Typography>
                        <Typography variant="body2">
                          {formatExpirationDate(video.createdAt)}
                        </Typography>
                        <Typography variant="body2">
                          {video.duration}
                        </Typography>
                        <Typography variant="body2">
                          {video.channelTitle}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleBanClick(video)}
                        sx={{ mt: { xs: 2, sm: 0 } }} // Agregamos margen superior solo en dispositivos móviles
                      >
                        Ban
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              ;
            </div>
          )}
        </div>
      ) : (
        <div>
          <Typography variant="h4" className="text-xl font-semibold mb-2">
            Screens
          </Typography>
          {screens.map((screen) => (
            <div
              key={screen.id}
              className="mb-4 p-2 border border-gray-300 flex justify-between items-center"
            >
              <Typography variant="h6">{screen.name}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleShowScreen(screen)}
              >
                Show Playlist Screen
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to ban this video?
          </Typography>
          {videoToBan && (
            <div>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Title: {videoToBan.title}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Created At: {videoToBan.createdAt}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Duration: {videoToBan.duration}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Channel Title: {videoToBan.channelTitle}
              </Typography>
            </div>
          )}
          <Button onClick={confirmBanVideo}>Yes, I'm sure</Button>
          <Button
            onClick={() => {
              setIsModalOpen(false);
              setVideoToBan(null);
            }}
            sx={{
              color: "red",
            }}
          >
            No, cancel
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default CurrentPlays;
