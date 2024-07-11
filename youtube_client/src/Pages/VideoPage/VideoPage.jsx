import React, { useEffect, useRef } from "react";
// import vid from "../../Components/Video/vid.mp4";
import "./VideoPage.css";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import Comments from "../../Components/Comments/Comments";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { addToHistory } from "../../actions/History";
import { viewVideo } from "../../actions/video";
import { addPoints } from "../../actions/points";

function VideoPage() {
  const { vid } = useParams();
  // console.log(vid);
  // const channels = useSelector((state) => state?.channelReducers);
  // const currentChannel = channels.filter((c) => c._id === vid)[0];

  const vids = useSelector((state) => state.videoReducer);
  const vv = vids?.data.filter((q) => q._id === vid)[0];
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.CurrentUserReducer);

  const handleHistory = () => {
    dispatch(
      addToHistory({
        videoId: vid,
        Viewer: CurrentUser?.result._id,
      })
    );
  };
  const handleViews = (vw) => {
    dispatch(
      viewVideo({
        id: vid,
      })
    );
  };
  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
    }
    handleViews();
  }, []);
  const videoRef = useRef(null);
  useEffect(() => {
    const videoElement = videoRef.current;
    const handlePlay = () => {
      console.log("Video started");
      console.log(`Video ID: ${vv?._id}`);
    };

    const handleEnded = () => {
      console.log("Video ended");
      console.log(`Video ID: ${vv?._id}`);
      dispatch(
        addPoints({
          id: CurrentUser?.result._id,
        })
      );
    };

    if (videoElement) {
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("ended", handleEnded);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("ended", handleEnded);
      }
    };
  }, [vid]);
  return (
    <>
      <div className="container_videoPage">
        <div className="container2_videoPage">
          <div className="video_display_screen_videoPage">
            <video
              ref={videoRef}
              src={`http://localhost:5500/${vv?.filePath}`}
              className="video_ShowVideo_videoPage"
              controls
              //   autoPlay
            ></video>
            <div className="video_details_videoPage">
              <div className="video_btns_title_videoPage_cont">
                <p className="video_title_videoPage">{vv?.videoTitle}</p>
                <div className="views_date_btns_VideoPage">
                  <div className="views_videoPage">
                    {vv?.Views} views <div className="dot"></div>{" "}
                    {moment(vv?.createdAt).fromNow()}
                  </div>
                  <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
                </div>
              </div>
              <Link
                to={`/channel/${vv?.videoChannel}`}
                className="channel_details_videoPage"
              >
                <b className="channel_logo_videoPage">
                  <p>{vv?.uploader.charAt(0).toUpperCase()}</p>
                </b>
                <p className="channel_name_videoPage">{vv?.uploader}</p>
              </Link>
              <div className="comments_videoPage">
                <h2>
                  <u>Comments</u>
                </h2>
                <Comments videoId={vv._id} />
              </div>
            </div>
          </div>
          <div className="moreVideoBar">More Videos</div>
        </div>
      </div>
    </>
  );
}

export default VideoPage;
