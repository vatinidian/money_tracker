import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";

class AddTransactionModal extends React.Component {
  constructor(props) {
    super(props);
    this.userId = "test";
    this.state = {
      transaction: {
        group: "",
        text: "",
        transactionDate: new Date().toISOString().substr(0, 10),
        updateInAccount: true,
        location: "",
        amount: "",
      },
      validated: false,
      continueAfterSave: false,
    };

    this.baseState = this.state;
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleTransactionSave = this.handleTransactionSave.bind(this);
  }
  handleFieldChange(event) {
    const target = event.target;
    let value;

    if (target.type === "checkbox") {
      value = target.checked;
    } else {
      value = target.value;
    }

    const name = target.name;
    if (name !== "continueAfterSave") {
      this.setState({
        transaction: { ...this.state.transaction, [name]: value },
      });
    } else {
      this.setState({ [name]: value });
    }
  }

  componentDidMount() {
    this.setState(this.baseState);
  }

  handleTransactionSave(event) {
    this.setState({ validated: true });

    let oPayload = Object.assign({}, this.state.transaction);

    if (!oPayload.amount) {
      return;
    }

    oPayload.user = this.userId; // CHANGE 
    oPayload.category = "General";
    oPayload.transactionMethod = +oPayload.amount < 0 ? "DEBIT" : "CREDIT";
    oPayload.amount = Math.abs(oPayload.amount);

    axios
      .post("/transactionList/add", oPayload)
      .then((req, res) => {
        if (!this.state.continueAfterSave) {
          this.props.onTransactionFinish();
        } else {
          this.props.onContinousTransaction();
        }
      })
      .catch((oError) => console.log(oError));
  }

  render() {
    return (
      <Modal
        onHide={this.props.onClose}
        show={this.props.show}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            id="transactionModalForm"
            autoComplete="off"
            onSubmit={this.handleTransactionSave}
            noValidate
            validated={this.state.validated}
          >
            <Form.Group controlId="formDescriptionField">
              <Form.Control
                name="text"
                onChange={this.handleFieldChange}
                autoFocus
                type="string"
                value={this.state.transaction.text}
                placeholder="Description"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Description.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formAmountField">
              <Row>
                <Col xs={12} md={6}>
                  <Form.Control
                    name="amount"
                    onChange={this.handleFieldChange}
                    required
                    type="number"
                    value={this.state.transaction.amount}
                    placeholder="Enter Amount"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide an Amount.
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Negative amount for Expense
                  </Form.Text>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Control
                    name="transactionDate"
                    onChange={this.handleFieldChange}
                    type="date"
                    required
                    value={this.state.transaction.transactionDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter Transaction Date.
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formGroup">
              <Row>
                <Col xs={12} md={6}>
                  <Form.Control
                    name="group"
                    type="string"
                    onChange={this.handleFieldChange}
                    value={this.state.transaction.group}
                    placeholder="Enter Group"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Form.Control
                    type="string"
                    name="location"
                    onChange={this.handleFieldChange}
                    value={this.state.transaction.location}
                    placeholder="Location?"
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                name="updateInAccount"
                onChange={this.handleFieldChange}
                checked={this.state.transaction.updateInAccount}
                label="Update Account Balance"
              />

              <Form.Check
                onChange={this.handleFieldChange}
                type="checkbox"
                name="continueAfterSave"
                checked={this.state.continueAfterSave}
                label="Continue with New Transaction after Save"
              />
            </Form.Group>

            <Row>
              <Col xs={12} md={12} className="text-right">
                <Button variant="primary" onClick={this.handleTransactionSave}>
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default AddTransactionModal;
