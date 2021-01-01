import { setSearchInput, setFireRefresh } from "../actions";
import { connect } from "react-redux";
import Header from "../components/Header";

const mapStateToProps = state => {
  return {
    searchInput: state.userPreference.searchInput,
    refreshInfo: state.userPreference.refreshInfo,
    loggedIn: state.userPreference.loggedIn,
    userInfo: state.userPreference.userInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSearchInput: data => dispatch(setSearchInput(data)),
    setFireRefresh: data => dispatch(setFireRefresh(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
