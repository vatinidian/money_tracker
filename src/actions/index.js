export const setSearchInput = data => {
  return {
    type: "setSearchInput",
    searchInput: data
  };
};

export const setFireRefresh = data => {
  return {
    type: "setFireRefresh",
    refreshInfo: data
  };
};

export const setUserLoginInfo = data => {
  return {
    type: "setUserLoginInfo",
    userInfo: data
  };
};