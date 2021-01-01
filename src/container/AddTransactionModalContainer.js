import { connect } from "react-redux";
import AddTransactionModal from "../components/AddTransactionModal";

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userPreference.loggedIn,
    userInfo: state.userPreference.userInfo
  };
};

export default connect(mapStateToProps)(AddTransactionModal);
