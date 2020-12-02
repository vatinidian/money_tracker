const initialState = {
  searchInput: "",
  refreshInfo: {
    refreshCounter : 0,
    refresh: false,
    filter: {}
  }
};

const userPreference = (state = initialState, action) => {
  switch (action.type) {
    case "setSearchInput":
      return { ...state, searchInput: action.searchInput };

    case "setFireRefresh":
      return { ...state, refreshInfo: action.refreshInfo };

    default:
      return state;
  }
};

export default userPreference;
