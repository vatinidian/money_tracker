import React from "react";
import { Button } from "react-bootstrap";
import AddTransactionModal from "./AddTransactionModal";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addTransactionClicked: false,
    };
    this.handleAddTransactionClick = this.handleAddTransactionClick.bind(this);
    this.handleAddTransactionClose = this.handleAddTransactionClose.bind(this);
    this.handleTransactionAddSuccess = this.handleTransactionAddSuccess.bind(
      this
    );
    this.handleContinousTransaction = this.handleContinousTransaction.bind(
      this
    );

    this.handleShowMyAccountTransaction = this.handleShowMyAccountTransaction.bind(
      this
    );
  }

  handleContinousTransaction() {
    this.props.setFireRefresh({
      refresh: true,
      refreshCounter: this.props.refreshInfo.refreshCounter + 1,
    });
  }

  handleShowMyAccountTransaction() {
    this.props.setFireRefresh({
      refresh: true,
      refreshCounter: this.props.refreshInfo.refreshCounter + 1,
      filter: { updateInAccount: true },
    });
  }

  handleTransactionAddSuccess() {
    this.setState({
      addTransactionClicked: false,
    });

    this.props.setFireRefresh({
      refresh: true,
      refreshCounter: this.props.refreshInfo.refreshCounter + 1,
    });
  }
  handleAddTransactionClose() {
    this.setState({
      addTransactionClicked: false,
    });
  }

  handleAddTransactionClick() {
    this.setState({
      addTransactionClicked: !this.state.addTransactionClicked,
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">
            Money Tracker
          </a>
          {/*<input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"/>*/}
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={this.handleAddTransactionClick}
              >
                Add Transaction
              </button>
              &nbsp;&nbsp;
              <button
                className="btn btn-secondary"
                type="button"
                onClick={this.handleShowMyAccountTransaction}
              >
                Show My Transaction
              </button>
            </li>
          </ul>
        </nav>

        {this.state.addTransactionClicked && (
          <AddTransactionModal
            sideTitle="Add Transaction"
            onContinousTransaction={this.handleContinousTransaction}
            onTransactionFinish={this.handleTransactionAddSuccess}
            show={this.state.addTransactionClicked}
            onClose={this.handleAddTransactionClose}
          />
        )}
      </div>
    );
  }
}

export default Header;
