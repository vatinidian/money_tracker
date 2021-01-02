import { connect } from "react-redux";
import UserSigningPage from "../components/UserSigningPage";
import { setUserLoginInfo } from "../actions";

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userPreference.loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserLoginInfo: (data) => dispatch(setUserLoginInfo(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSigningPage);
