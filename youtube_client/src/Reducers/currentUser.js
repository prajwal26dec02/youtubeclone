const CurrentUserReducer = (state = null, action) => {
  switch (action.type) {
    case "FETCH_CURRENT_USER":
      return action.payload;
    case "UPDATE_USER":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};
export default CurrentUserReducer;
