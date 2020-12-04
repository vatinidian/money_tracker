import React from "react";
import axios from "axios";
import $ from "jquery";
import { MdDelete } from "react-icons/md";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.userId = "test";
    this.state = {
      transactionListBusy: true,
      refresh: false,
      refreshCounter: 0,
      filter: {},
      TransactionList: [],
      TransactionInfo: {
        Balance: "",
        Expense: 0,
        Credit: 0,
      },
    };

    this.handleTransactionDelete = this.handleTransactionDelete.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.refreshInfo && nextProps.refreshInfo.refresh) {
      return {
        refresh: true,
        refreshCounter: nextProps.refreshInfo.refreshCounter,
        filter: nextProps.refreshInfo.filter
      }; // <- this is setState equivalent
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.refreshCounter !== this.state.refreshCounter &&
      this.state.refresh
    ) {
      this.getTransactionList(this.userId, this.state.filter);
    }
  }

  componentDidMount() {
    this.readUserAccountInfo(this.userId);
    this.getTransactionList(this.userId);
  }

  handleTransactionDelete(oTransaction) {
    if (
      !oTransaction ||
      $.isEmptyObject(oTransaction) ||
      !oTransaction.transactionID
    ) {
      return;
    }
    axios
      .delete("/transactionList/delete", {
        data: {
          transactionID: oTransaction.transactionID,
          user: oTransaction.user,
          transactionMethod: oTransaction.transactionMethod,
          updateInAccount: oTransaction.updateInAccount,
          amount: oTransaction.amount,
        },
      })
      .then((response) => {
        this.getTransactionList(this.userId);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  readUserAccountInfo(sUserID) {
    axios
      .get("/userAccount/checkAccount/" + sUserID)
      .then((response) => {
        this.setState({
          TransactionInfo: {
            ...this.state.TransactionInfo,
            Balance: response.data.accountBalance,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  calculateTransaction() {
    let Expense = 0;
    let Credit = 0;

    this.state.TransactionList.forEach((Transaction) => {
      if (Transaction.transactionMethod === "DEBIT") {
        Expense += Transaction.amount;
      } else if (Transaction.transactionMethod === "CREDIT") {
        Credit += Transaction.amount;
      }
    });

    this.setState({
      TransactionInfo: {
        ...this.state.TransactionInfo,
        Expense: Expense,
        Credit: Credit,
      },
    });
    return <></>;
  }

  getTransactionList(sUserId, oParam) {
    this.setState({ transactionListBusy: true });
    let oQueryParams = {
      searchFilter: "",
      user: sUserId,
      ...oParam,
    };
    axios
      .get("/transactionList", {
        params: oQueryParams,
      })
      .then((response) => {
        this.setState({ TransactionList: response.data });
        this.setState({ transactionListBusy: false });
        this.calculateTransaction();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createTransactionSingleRow(Transaction) {
    return (
      <tr key={Transaction.transactionID}>
        <td style={{ width: "15%" }}>
          {Transaction.transactionDate.substr(0, 10)}
        </td>
        <td style={{ width: "15%" }}>{Transaction.group}</td>
        <td style={{ width: "25%" }}>{Transaction.text}</td>
        <td style={{ width: "10%" }}>{Transaction.transactionMethod}</td>
        <td style={{ width: "15%" }}>{Transaction.category}</td>
        <td style={{ width: "10%" }}>{Transaction.amount}</td>
        <td style={{ width: "10%" }}>
          <button
            type="button"
            className="btn btn-default"
            onClick={this.handleTransactionDelete.bind(this, Transaction)}
          >
            <MdDelete />
          </button>
        </td>
      </tr>
    );
  }
  createTableGroupHeader(Transaction) {
    return (
      <tr className="tableGroupHeaderRow" key={Transaction.group}>
        <td></td>
        <td>{Transaction.group.toUpperCase() || "MISC"}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }
  createTransactionRows() {
    let aTransactions = this.state.TransactionList || [];
    let iLength = aTransactions.length;
    if (iLength <= 0) {
      return null;
    }
    let aRows = [
      this.createTableGroupHeader(aTransactions[0]),
      this.createTransactionSingleRow(aTransactions[0]),
    ];
    for (let i = 1; i < iLength; i++) {
      if (
        aTransactions[i].group.toLowerCase() !==
        aTransactions[i - 1].group.toLowerCase()
      ) {
        aRows.push(this.createTableGroupHeader(aTransactions[i]));
      }

      aRows.push(this.createTransactionSingleRow(aTransactions[i]));
    }

    return aRows;
  }

  render() {
    return (
      <div className="container-fluid">
        <div className=" my-2 row">
          <div className="col verticalLine">
            <h6>
              Hello {this.userId},
              <br />
              Available Balance: <small className="text-muted">Rs </small>
              {!this.state.TransactionInfo.Balance &&
              this.state.TransactionInfo.Balance !== 0 ? (
                <Spinner animation="border" size="sm" variant="primary"></Spinner>
              ) : (
                this.state.TransactionInfo.Balance
              )}
            </h6>
          </div>

          <div className="col">
            <div className="card">
              <div className="p-2 card-body">
                <h5 className="card-title pricing-card-title">
                  <a href="#" className="card-link">
                    Expense
                  </a>
                  <br />
                  <small className="text-muted">Rs </small>
                  {this.state.TransactionInfo.Expense}{" "}
                </h5>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="p-2 card-body">
                <h5 className="card-title pricing-card-title">
                  <a href="#" className="card-link">
                    Credit
                  </a>
                  <br />
                  <small className="text-muted">Rs </small>
                  {this.state.TransactionInfo.Credit}
                </h5>
              </div>
            </div>
          </div>
        </div>

        <h5>Transaction List</h5>
        <Table responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Group</th>
              <th>Text</th>
              <th>Transaction</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.createTransactionRows()}</tbody>
        </Table>
        {this.state.transactionListBusy && (
          <div className="text-center">
            <Spinner animation="border" variant="primary">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}
      </div>
    );
  }
}

export default Dashboard;
