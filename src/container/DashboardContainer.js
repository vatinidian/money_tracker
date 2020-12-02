import { connect } from "react-redux";
import Dashboard from "../components/Dashboard";

const mapStateToProps = (state) => {
  return {
    searchInput: state.userPreference.searchInput,
    refreshInfo: state.userPreference.refreshInfo
  };
};

export default connect(mapStateToProps)(Dashboard);
