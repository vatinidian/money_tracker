const dataStoreReducer = (state = {}, action) => {
  switch (action.type) {
    case "setCategories":
      return { ...state, categories: action.categories };
    default:
      return state;
  }
};

export default dataStoreReducer;
