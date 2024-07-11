import { React, useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import "./LikeWatchLaterSaveBtns.css";
import { MdPlaylistAddCheck } from "react-icons/md";
import {
  RiHeartAddFill,
  RiPlayListAddFill,
  RiShareForwardLine,
} from "react-icons/ri";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { likeVideo } from "../../actions/video";
import { addToLikedVideo, deleteLikeVideo } from "../../actions/likedVideo";
import { addToWatchLater, deleteWatchLater } from "../../actions/watchLater";

function LikeWatchLaterSaveBtns({ vv, vid }) {
  const CurrentUser = useSelector((state) => state?.CurrentUserReducer);
  const dispatch = useDispatch();
  const [saveVideo, setSaveVideo] = useState(false);
  const [dislikeBtn, setDislikeBtn] = useState(false);
  const [likeBtn, setLikeBtn] = useState(false);
  const likedVideoList = useSelector((state) => state.likedVideoReducer);
  const watchLaterList = useSelector((state) => state.watchLaterReducer);

  useEffect(() => {
    likedVideoList?.data
      .filter(
        (q) => q?.videoId === vid && q?.Viewer === CurrentUser?.result._id
      )
      .map((m) => setLikeBtn(true));
    watchLaterList?.data
      .filter(
        (q) => q?.videoId === vid && q?.Viewer === CurrentUser?.result._id
      )
      .map((m) => setSaveVideo(true));
  }, []);

  const toggleSavedVideo = () => {
    if (CurrentUser) {
      if (saveVideo) {
        setSaveVideo(false);
        dispatch(
          deleteWatchLater({
            videoId: vid,
            Viewer: CurrentUser?.result._id,
          })
        );
      } else {
        setSaveVideo(true);
        dispatch(
          addToWatchLater({
            videoId: vid,
            Viewer: CurrentUser?.result._id,
          })
        );
      }
    } else {
      alert("Please Login to save video");
    }
  };
  const toggleLikeBtn = (e, lk) => {
    if (CurrentUser) {
      if (likeBtn) {
        setLikeBtn(false);
        dispatch(
          likeVideo({
            id: vid,
            Like: lk - 1,
          })
        );
        dispatch(
          deleteLikeVideo({
            videoId: vid,
            Viewer: CurrentUser?.result._id,
          })
        );
      } else {
        setLikeBtn(true);
        dispatch(
          likeVideo({
            id: vid,
            Like: lk + 1,
          })
        );
        dispatch(
          addToLikedVideo({
            videoId: vid,
            Viewer: CurrentUser?.result._id,
          })
        );
        setDislikeBtn(false);
      }
    } else {
      alert("Please Login To Give A Like");
    }
  };
  const toggleDislikeBtn = (e, lk) => {
    if (CurrentUser) {
      if (dislikeBtn) {
        setDislikeBtn(false);
      } else {
        setDislikeBtn(true);
        if (likeBtn) {
          dispatch(
            likeVideo({
              id: vid,
              Like: lk - 1,
            })
          );
          dispatch(
            deleteLikeVideo({
              videoId: vid,
              Viewer: CurrentUser?.result._id,
            })
          );
        }

        setLikeBtn(false);
      }
    } else {
      alert("Please Login To Give A Like");
    }
  };
  return (
    <div className="btns_cont_videoPage">
      <div className="btn_VideoPage">
        <BsThreeDots />
      </div>
      <div className="btn_VideoPage">
        <div
          className="like_videoPage"
          onClick={(e) => toggleLikeBtn(e, vv.Like)}
        >
          {likeBtn ? (
            <>
              <AiFillLike size={22} className="btns_videoPage" />
            </>
          ) : (
            <>
              <AiOutlineLike size={22} className="btns_videoPage" />
            </>
          )}
          <b>{vv?.Like}</b>
        </div>
        <div
          className="like_videoPage"
          onClick={(e) => toggleDislikeBtn(e, vv.Like)}
        >
          {dislikeBtn ? (
            <>
              <AiFillDislike size={22} className="btns_videoPage" />
            </>
          ) : (
            <>
              <AiOutlineDislike size={22} className="btns_videoPage" />
            </>
          )}
          <b>DISLIKE</b>
        </div>
        <div className="like_videoPage" onClick={() => toggleSavedVideo()}>
          {saveVideo ? (
            <>
              <MdPlaylistAddCheck size={22} className="btns_videoPage" />
              <b>Saved</b>
            </>
          ) : (
            <>
              <RiPlayListAddFill size={22} className="btns_videoPage" />
              <b>Save</b>
            </>
          )}
        </div>
        <div className="like_videoPage">
          <>
            <RiHeartAddFill size={22} className="btns_videoPage" />
            <b>Thanks</b>
          </>
        </div>
        <div className="like_videoPage">
          <>
            <RiShareForwardLine size={22} className="btns_videoPage" />
            <b>Share</b>
          </>
        </div>
      </div>
    </div>
  );
}

export default LikeWatchLaterSaveBtns;
