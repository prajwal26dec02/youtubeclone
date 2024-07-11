import * as api from "../api";

export const addPoints = (pointsData) => async (dispatch) => {
  try {
    const { id } = pointsData;
    // console.log("Dispatching addPoints action with id:", id);
    const { data } = await api.addPoints(id);
    // console.log("Received response from API:", data);
    dispatch({ type: "POST_POINTS", payload: data });
    dispatch({ type: "UPDATE_USER", payload: data });
  } catch (error) {
    console.log(error);
    console.log("Error in actions");
  }
};
