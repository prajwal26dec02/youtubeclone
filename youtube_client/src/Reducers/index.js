import { combineReducers } from "redux";
import authReducer from "./auth";
import CurrentUserReducer from "./currentUser";
import channelReducers from "./channel";
import videoReducer from "./Video";
import likedVideoReducer from "./likedVideo";
import watchLaterReducer from "./watchLater";
import HistoryReducer from "./history";
import commentReducer from "./comments";
import pointsReducer from "./points";

export default combineReducers({
  authReducer,
  CurrentUserReducer,
  channelReducers,
  videoReducer,
  likedVideoReducer,
  watchLaterReducer,
  HistoryReducer,
  commentReducer,
  pointsReducer,
});
