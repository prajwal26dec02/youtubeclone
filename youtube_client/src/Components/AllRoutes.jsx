import React from "react";
import Home from "../Pages/Home/Home";
import WatchHistory from "../Pages/WatchHistory/WatchHistory";
import WatchLater from "../Pages/WatchLater/WatchLater";
import YourVideo from "../Pages/YourVideo/YourVideo";
import LikedVideo from "../Pages/LikedVideo/LikedVideo";
import { Routes, Route } from "react-router-dom";
import Library from "../Pages/Library/Library";
import VideoPage from "../Pages/VideoPage/VideoPage";
import Channel from "../Pages/Channel/Channel";
import Search from "../Pages/Search/Search";

function AllRoutes({ setEditCreateChannelBtn, setVidUploadPage }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/likedvideo" element={<LikedVideo />} />
        <Route path="/history" element={<WatchHistory />} />
        <Route path="/watchlater" element={<WatchLater />} />
        <Route path="/yourvideos" element={<YourVideo />} />
        <Route path="/videopage/:vid" element={<VideoPage />} />
        <Route path="/search/:searchQuery" element={<Search />} />
        <Route
          path="/channel/:Cid"
          element={
            <Channel
              setVidUploadPage={setVidUploadPage}
              setEditCreateChannelBtn={setEditCreateChannelBtn}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default AllRoutes;
