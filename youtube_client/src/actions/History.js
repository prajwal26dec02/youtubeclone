import * as api from "../api";

export const addToHistory = (historyData) => async (dispatch) => {
  try {
    // console.log(historyData);
    const { data } = await api.addToHistory(historyData);
    dispatch({ type: "POST_HISTORY", data });
    dispatch(getAllhistory());
  } catch (error) {
    console.log(error);
  }
};

export const getAllhistory = () => async (dispatch) => {
  try {
    const { data } = await api.getAllhistory();
    dispatch({ type: "FETCH_ALL_HISTORY_VIDEOS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const clearHistory = (historyData) => async (dispatch) => {
  try {
    const { userId } = historyData;
    await api.deleteHistory(userId);
    dispatch(getAllhistory());
  } catch (error) {
    console.log(error);
  }
};
