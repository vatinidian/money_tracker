import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import axios from "axios";

class UserSigningPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginFormVisible: true,
      userEntryMessage: "",
      username: "",
      password: "",
      userSignUpInfo: {
        username: "",
        password: "",
        emailID: "",
        privacy: "",
        firstname: "",
        lastname: "",
      },
    };

    this.baseState = this.state;
    this.handleUserEntry = this.handleUserEntry.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNextPageLoad = this.handleNextPageLoad.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
  }

  handleEnterKey(oEvent) {
    if (oEvent.key === "Enter") {
      this.handleUserEntry();
    }
  }

  handleNextPageLoad() {
    let oForm = document.getElementById("loginForm");
    let oForm1 = document.getElementById("signUpForm");
    if (oForm) {
      oForm.className = "";
    } else if (oForm1) {
      oForm1.className = "";
    }

    this.setState(this.baseState);

    this.setState({
      loginFormVisible: !this.state.loginFormVisible,
    });
  }

  handleUserEntry() {
    if (this.state.loginFormVisible) {
      this.doLogin();
    } else {
      this.doSignUp();
    }
  }

  doSignUp() {
    this.setState({
      userEntryMessage: "",
    });
    let oForm = document.getElementById("signUpForm");
    oForm.className = "checkInvalid";
    if (!oForm.reportValidity()) {
      return;
    }

    axios
      .post("/user/register", {
        username: this.state.userSignUpInfo.username,
        password: this.state.userSignUpInfo.password,
        emailID: this.state.userSignUpInfo.emailID,
        lastname: this.state.userSignUpInfo.lastname,
        firstname: this.state.userSignUpInfo.firstname,
      })
      .then((req, res) => {
        if (req.data && req.data.status === "NEW_USER") {
          this.props.setUserLoginInfo(req.data.userInfo);
          this.props.onLoggedIn();
        } else if (req.data.status) {
          // Handle Other cases here
          this.setState({
            userEntryMessage: "SignUp Failed : " + req.data.statusText,
          });
        } else {
          this.setState({
            userEntryMessage: "SignUp Failed",
          });
        }
      })
      .catch((oError) => console.log(oError));
  }

  doLogin() {
    this.setState({
      userEntryMessage: "",
    });
    let oForm = document.getElementById("loginForm");
    // oForm.className = "checkInvalid";
    if (!oForm.reportValidity()) {
      return;
    }

    axios
      .get("/user/login", {
        auth: {
          username: this.state.username,
          password: this.state.password,
        },
      })
      .then((req, res) => {
        if (req.data && req.data.status === "LOGGED_IN") {
          this.props.setUserLoginInfo(req.data.userInfo);
          this.props.onLoggedIn();
        } else if (req.data.status) {
          // Handle Other cases here
          this.setState({
            userEntryMessage: "Logon Failed : " + req.data.statusText,
          });
        } else {
          this.setState({
            userEntryMessage: "Logon Failed",
          });
        }
      })
      .catch((oError) => console.log(oError));
  }

  handleInputChange(event) {
    const target = event.target;
    let value;

    if (target.type === "select-one" && target.selectedOptions[0]) {
      value = target.selectedOptions[0].value;
    } else {
      value = target.value;
    }

    const name = target.name;

    if (this.state.loginFormVisible) {
      this.setState({ [name]: value });
    } else {
      this.setState({
        userSignUpInfo: { ...this.state.userSignUpInfo, [name]: value },
      });
    }
  }

  getUserEntryContent() {
    let oUserEntryBodyContent;
    if (this.state.loginFormVisible) {
      oUserEntryBodyContent = (
        <>
          <Alert variant="primary">
            {this.state.userEntryMessage || this.props.message}
          </Alert>
          <Form
            id="loginForm"
            autoComplete="off"
            onSubmit={this.handleUserEntry}
            noValidate
            validated={this.state.validated}
          >
            <Form.Group controlId="formUsernameGroup">
              <Form.Control
                name="username"
                onChange={this.handleInputChange}
                autoFocus
                type="string"
                value={this.state.username}
                placeholder="UserName"
                required
              />
              <Form.Control.Feedback type="invalid">
                Enter Username
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPasswordGroup">
              <Form.Control
                name="password"
                onChange={this.handleInputChange}
                type="password"
                value={this.state.password}
                placeholder="Password"
                required
              />
            </Form.Group>
          </Form>
        </>
      );
    } else {
      oUserEntryBodyContent = (
        <>
          <Alert variant="primary">
            {this.state.userEntryMessage || this.props.message}
          </Alert>
          <Form
            id="signUpForm"
            autoComplete="off"
            onSubmit={this.handleUserEntry}
            noValidate
            validated={this.state.validated}
          >
            <Form.Group controlId="formNameGroup">
              <Form.Control
                name="firstname"
                onChange={this.handleInputChange}
                autoFocus
                type="string"
                value={this.state.userSignUpInfo.firstname}
                placeholder="First Name"
                required
              />
              <Form.Control
                name="lastname"
                onChange={this.handleInputChange}
                type="string"
                value={this.state.userSignUpInfo.lastname}
                placeholder="Last Name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formUserNameGroup">
              <Form.Control
                name="username"
                onChange={this.handleInputChange}
                type="string"
                value={this.state.userSignUpInfo.username}
                placeholder="User Name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formUserPasswordGroup">
              <Form.Control
                name="password"
                onChange={this.handleInputChange}
                type="password"
                value={this.state.userSignUpInfo.password}
                placeholder="Password"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmailGroup">
              <Form.Control
                name="emailID"
                onChange={this.handleInputChange}
                type="email"
                value={this.state.userSignUpInfo.emailID}
                placeholder="Email"
                required
              />
            </Form.Group>
          </Form>
        </>
      );
    }
    return <div className="userEntryContent">{oUserEntryBodyContent}</div>;
  }

  render() {
    if (!this.props.show || this.props.loggedIn) {
      return null;
    }

    return (
      <Modal
        onHide={this.props.onClose}
        show={this.props.show}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.state.loginFormVisible ? "Login" : "Create Account"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.getUserEntryContent()}</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleNextPageLoad}>
            {this.state.loginFormVisible ? "Create Account" : "Back To Login"}
          </Button>
          <Button variant="primary" onClick={this.handleUserEntry}>
            {this.state.loginFormVisible ? "Login" : "Create Account"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default UserSigningPage;
