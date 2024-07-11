const pointsReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "POST_POINTS":
      return { ...state, data: action?.data };
    default:
      return state;
  }
};
export default pointsReducer;
