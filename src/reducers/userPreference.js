const initialState = {
  searchInput: "",
  loggedIn: false,
  userInfo: {},
  refreshInfo: {
    refreshCounter: 0,
    refresh: false,
    filter: {},
  },
};

const userPreference = (state = initialState, action) => {
  switch (action.type) {
    case "setSearchInput":
      return { ...state, searchInput: action.searchInput };

    case "setFireRefresh":
      return { ...state, refreshInfo: action.refreshInfo };

    case "setUserLoginInfo":
      return { ...state, loggedIn: true, userInfo: action.userInfo };

    default:
      return state;
  }
};

export default userPreference;
