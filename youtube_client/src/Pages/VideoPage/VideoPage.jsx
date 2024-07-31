import React, { forwardRef, useEffect, useRef } from "react";
// import vid from "../../Components/Video/vid.mp4";
import "./VideoPage.css";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import Comments from "../../Components/Comments/Comments";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { addToHistory } from "../../actions/History";
import { viewVideo } from "../../actions/video";
import { addPoints } from "../../actions/points";
import { IoMdFastforward, IoMdRewind, IoMdVolumeMute } from "react-icons/io";
import {
  MdFullscreen,
  MdFullscreenExit,
  MdPause,
  MdPlayArrow,
} from "react-icons/md";
import { IoMdVolumeHigh } from "react-icons/io";
import { useState } from "react";
import axios from "axios";

function VideoPage() {
  const { vid } = useParams();
  // console.log(vid);
  // const channels = useSelector((state) => state?.channelReducers);
  // const currentChannel = channels.filter((c) => c._id === vid)[0];

  const vids = useSelector((state) => state.videoReducer);
  const vv = vids?.data.filter((q) => q._id === vid)[0];
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.CurrentUserReducer);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);
  const [doubleClickTimeout, setDoubleClickTimeout] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const apiKey = process.env.REACT_APP_API_KEY;
  const commentsRef = useRef(null);
  const navnext = useNavigate();

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );
        console.log(response.data);
        setWeatherData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.error(error)
    );
  }, [apiKey]);

  const handlePopupClick = () => {
    setShowPopup(!showPopup);
  };

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
  const videoRef = useRef(null);
  const [holding, setHolding] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
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
          videoId: vid,
          id: CurrentUser?.result._id,
        })
      );
      if (CurrentUser) {
        handleHistory();
      }
      handleViews();
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleMouseDown = (e) => {
    if (doubleClickTimeout) {
      clearTimeout(doubleClickTimeout);
    }

    setDoubleClickTimeout(
      setTimeout(() => {
        setHolding(true);

        const { clientX, target } = e;
        const { left, right } = target.getBoundingClientRect();
        const tapPosition = clientX - left;
        const containerWidth = right - left;
        if (tapPosition < containerWidth / 3) {
          setPlaybackRate(0.5);
          speedRef.current.classList.add("show");
        } else if (tapPosition > (2 * containerWidth) / 3) {
          setPlaybackRate(2);
          speedRef.current.classList.add("show");
        }
      }, 100)
    );
  };

  const handleMouseUp = () => {
    setHolding(false);
    setPlaybackRate(1);
    speedRef.current.classList.remove("show");

    if (doubleClickTimeout) {
      clearTimeout(doubleClickTimeout);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("mousedown", handleMouseDown);
      }
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const closeWebsite = () => {
    if (window.confirm("Are you sure you want to close the website?")) {
      window.open("", "_self").close();
    }
  };

  const rewindRef = useRef(null);
  const forwrdRef = useRef(null);
  const speedRef = useRef(null);
  const playpauseRef = useRef(null);

  const handleDoubleClick = (e) => {
    e.preventDefault();
    const { clientX, currentTarget } = e;
    const { left, right } = currentTarget.getBoundingClientRect();
    const tapPosition = clientX - left;
    const containerWidth = right - left;
    if (tapPosition < containerWidth / 3) {
      if (videoRef.current.currentTime >= 10) {
        videoRef.current.currentTime -= 10;
      } else {
        videoRef.current.currentTime = 0;
      }
      showNotification(rewindRef.current);
    } else if (tapPosition > (2 * containerWidth) / 3) {
      if (videoRef.current.currentTime <= videoRef.current.duration - 10) {
        videoRef.current.currentTime += 10;
      } else {
        videoRef.current.currentTime = videoRef.current.duration;
      }
      showNotification(forwrdRef.current);
    }
  };

  const handleClick = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, right, top, bottom } = currentTarget.getBoundingClientRect();
    const tapPositionX = clientX - left;
    const tapPositionY = clientY - top;
    const containerWidth = right - left;
    const containerHeight = bottom - top;
    if (tapPositionX < containerWidth / 3) {
      setTapCount((prevCount) => prevCount + 1);
      setTimeout(() => setTapCount(0), 500);
      if (tapCount === 2) {
        commentsRef.current.scrollIntoView({ behavior: "smooth" });
        setTapCount(0);
      }
    } else if (tapPositionX > (2 * containerWidth) / 3) {
      setTapCount((prevCount) => prevCount + 1);
      setTimeout(() => setTapCount(0), 500);
      if (tapCount === 2) {
        closeWebsite();
        setTapCount(0);
      }
    } else {
      setTapCount((prevCount) => prevCount + 1);
      setTimeout(() => setTapCount(0), 500);
      if (tapCount === 2) {
        navigateToNextVideo();
        setTapCount(0);
      } else {
        if (videoRef.current.paused) {
          videoRef.current.play();
          playpauseRef.current.setAttribute("status", "play");
          playpauseRef?.current?.classList?.add("show");
          setTimeout(() => {
            playpauseRef?.current?.classList?.remove("show");
          }, 1000);
        } else {
          videoRef.current.pause();
          playpauseRef.current.setAttribute("status", "pause");
          playpauseRef?.current?.classList?.add("show");
        }
      }
    }
    if (
      tapPositionX > (3 * containerWidth) / 4 &&
      tapPositionY < containerHeight / 4
    ) {
      handlePopupClick();
    }
  };

  const navigateToNextVideo = () => {
    const currentVideoIndex = vids.data.findIndex((video) => video._id === vid);
    if (currentVideoIndex !== -1 && currentVideoIndex < vids.data.length - 1) {
      const nextVideoId = vids.data[currentVideoIndex + 1]._id;
      navnext(`/videopage/${nextVideoId}`);
    } else {
      console.log("No more videos available.");
    }
  };

  const showNotification = (element) => {
    if (element) {
      element.classList?.add("show");
      setTimeout(() => {
        element.classList?.remove("show");
      }, 1000);
    }
  };

  const handleFullscreenCSS = () => {
    if (videoRef.current) {
      const videoContainer = videoRef.current.parentNode;
      if (videoContainer.classList.contains("fullscreen-video-container")) {
        videoContainer.classList.remove("fullscreen-video-container");
        videoRef.current.classList.remove("fullscreen-video");
        document.body.style.overflow = "";
      } else {
        videoContainer.classList.add("fullscreen-video-container");
        videoRef.current.classList.add("fullscreen-video");
        document.body.style.overflow = "hidden";
      }
    }

    setIsFullscreen(!isFullscreen);
  };
  const [sliderVisibility, setSliderVisibility] = useState(false);
  const [volume, setVolume] = useState(1);
  const volumeBtnRef = useRef(null);

  const toggleSliderVisibility = () => {
    setSliderVisibility(!sliderVisibility);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }

    if (volumeBtnRef.current) {
      if (newVolume === 0) {
        volumeBtnRef.current.setAttribute("data-volume-level", "muted");
      } else {
        volumeBtnRef.current.setAttribute("data-volume-level", "high");
      }
    }
  };

  useEffect(() => {
    if (volumeBtnRef.current) {
      volumeBtnRef.current.setAttribute("data-volume-level", "high");
    }
  }, []);

  const [controlsVisible, setControlsVisible] = useState(true);
  let hideControlsTimeout;

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleMouseMove = () => {
      setControlsVisible(true);
      clearTimeout(hideControlsTimeout);

      if (!videoElement.paused) {
        hideControlsTimeout = setTimeout(() => {
          setControlsVisible(false);
        }, 2000);
      }
    };

    const handlePausePlay = () => {
      setControlsVisible(true);
      clearTimeout(hideControlsTimeout);

      if (!videoElement.paused) {
        hideControlsTimeout = setTimeout(() => {
          setControlsVisible(false);
        }, 700);
      }
    };

    videoElement.addEventListener("mousemove", handleMouseMove);
    videoElement.addEventListener("play", handlePausePlay);
    videoElement.addEventListener("pause", handlePausePlay);

    return () => {
      videoElement.removeEventListener("mousemove", handleMouseMove);
      videoElement.removeEventListener("play", handlePausePlay);
      videoElement.removeEventListener("pause", handlePausePlay);
      clearTimeout(hideControlsTimeout);
    };
  }, []);
  return (
    <>
      <div className="container_videoPage">
        <div className="container2_videoPage">
          <div
            className={`video_display_screen_videoPage ${
              isFullscreen ? "fullscreen-video-container" : ""
            }`}
          >
            <div
              className="video_container_videoPage"
              onDoubleClick={handleDoubleClick}
              onClick={handleClick}
            >
              <video
                ref={videoRef}
                src={`http://localhost:5500/${vv?.filePath}`}
                className="video_ShowVideo_videoPage"
                controls
                controlsList="nofullscreen"
              ></video>
              <div
                ref={playpauseRef}
                className={`playpause_notification ${
                  isFullscreen ? "fullscreen" : ""
                }`}
                status="play"
              >
                <i className="play_logo">
                  <MdPlayArrow />
                </i>
                <i className="pause_logo">
                  <MdPause />
                </i>
              </div>
              <div
                ref={rewindRef}
                class={`rewind_notification ${
                  isFullscreen ? "fullscreen" : ""
                }`}
              >
                <div class="rewind_icon">
                  <i class="rewind_logo">
                    <IoMdRewind />
                  </i>
                  <span class="rewind_text">10 seconds</span>
                </div>
              </div>
              <div
                ref={forwrdRef}
                class={`forward_notification ${
                  isFullscreen ? "fullscreen" : ""
                }`}
              >
                <div class="forward_icon">
                  <i class="forward_logo">
                    <IoMdFastforward />
                  </i>
                  <span class="forward_text">10 seconds</span>
                </div>
              </div>
              <div
                ref={speedRef}
                class={`speed_notification ${isFullscreen ? "fullscreen" : ""}`}
              >
                <div class="speed_icon">
                  <span class="speed_text">
                    {playbackRate}x <IoMdFastforward />
                  </span>
                </div>
              </div>
              <div
                className={`fullscreen_btn_VideoPage ${
                  controlsVisible ? "show" : ""
                }`}
                onClick={handleFullscreenCSS}
                fullscreen={isFullscreen.toString()}
                ref={fullscreenRef}
              >
                <i className="fullscreen_logo">
                  <MdFullscreen />
                </i>
                <i className="small_screen_btn">
                  <MdFullscreenExit />
                </i>
              </div>
              <div
                className={`volume_container ${controlsVisible ? "show" : ""}`}
              >
                <div
                  className={`volume_btn ${isFullscreen ? "fullscreen" : ""} `}
                  data-volume-level="high"
                  onClick={toggleSliderVisibility}
                  ref={volumeBtnRef}
                >
                  <i
                    className={`volume_high ${
                      isFullscreen ? "fullscreen" : ""
                    }`}
                  >
                    <IoMdVolumeHigh />
                  </i>
                  <i
                    className={`volume_muted ${
                      isFullscreen ? "fullscreen" : ""
                    }`}
                  >
                    <IoMdVolumeMute />
                  </i>
                </div>
                <input
                  className={`volume_slider ${
                    sliderVisibility ? "visible" : ""
                  } ${isFullscreen ? "fullscreen" : ""}`}
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
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
                <h2 ref={commentsRef}>
                  <u>Comments</u>
                </h2>
                <Comments videoId={vv._id} />
              </div>
            </div>
          </div>
          <div
            className="weather_popup"
            style={{ display: showPopup ? "block" : "none" }}
          >
            {weatherData && (
              <>
                <p>Location: {weatherData.name}</p>
                <p>Temperature: {weatherData.main.temp}K</p>
              </>
            )}
          </div>
          <div className="moreVideoBar">More Videos</div>
        </div>
      </div>
    </>
  );
}

export default VideoPage;
