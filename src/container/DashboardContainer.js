import { connect } from "react-redux";
import Dashboard from "../components/Dashboard";

const mapStateToProps = (state) => {
  return {
    searchInput: state.userPreference.searchInput,
    refreshInfo: state.userPreference.refreshInfo,
    loggedIn: state.userPreference.loggedIn,
    userInfo: state.userPreference.userInfo
  };
};

export default connect(mapStateToProps)(Dashboard);
