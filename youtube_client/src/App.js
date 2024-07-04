import "./App.css";
import AllRoutes from "./Components/AllRoutes";
import DrawerSidebar from "./Components/LeftSidebar/DrawerSidebar";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateEditChannel from "./Pages/Channel/CreateEditChannel";
import { useDispatch } from "react-redux";
import { fetchAllChannel } from "./actions/channelUser";
import VideoUpload from "./Pages/VideoUpload/VideoUpload";
import { getAllVideo } from "./actions/video";
import { getAlllikeVideo } from "./actions/likedVideo";
import { getAllwatchLater } from "./actions/watchLater";
import { getAllhistory } from "./actions/History";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllChannel());
    dispatch(getAllVideo());
    dispatch(getAlllikeVideo());
    dispatch(getAllwatchLater());
    dispatch(getAllhistory());
  }, [dispatch]);

  const [toggleDrawerSidebar, setToggleDrawerSidebar] = useState({
    display: "none",
  });
  const toggleDrawer = () => {
    if (toggleDrawerSidebar.display === "none") {
      setToggleDrawerSidebar({
        display: "flex",
      });
    } else {
      setToggleDrawerSidebar({
        display: "none",
      });
    }
  };
  const [editCreateChannelBtn, setEditCreateChannelBtn] = useState(false);
  const [vidUploadPage, setVidUploadPage] = useState(false);
  return (
    <>
      <Router>
        {vidUploadPage && <VideoUpload setVidUploadPage={setVidUploadPage} />}
        {editCreateChannelBtn && (
          <CreateEditChannel
            setEditCreateChannelBtn={setEditCreateChannelBtn}
          />
        )}
        <Navbar
          setEditCreateChannelBtn={setEditCreateChannelBtn}
          toggleDrawer={toggleDrawer}
        />
        {
          <DrawerSidebar
            toggleDrawer={toggleDrawer}
            toggleDrawerSidebar={toggleDrawerSidebar}
          />
        }
        <AllRoutes
          setVidUploadPage={setVidUploadPage}
          setEditCreateChannelBtn={setEditCreateChannelBtn}
        />
      </Router>
    </>
  );
}

export default App;
