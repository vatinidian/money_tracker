import React from "react";
import axios from "axios";
import $ from "jquery";
import { MdDelete } from "react-icons/md";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.userId = "test";
    this.state = {
      refresh: false,
      refreshCounter: 0,
      filter: {},
      TransactionList: [],
      TransactionInfo: {
        Balance: 0,
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
        filter : nextProps.refreshInfo.filter
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
    this.readUserAccountInfo(this.userId);

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
    let oQueryParams = {
      searchFilter: "",
      user: sUserId,
      ...oParam
    };
    axios
      .get("http://localhost:5000/transactionList", {
        params: oQueryParams
      })
      .then((response) => {
        this.setState({ TransactionList: response.data });
        this.calculateTransaction();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createTransactionSingleRow(Transaction) {
    return (
      <tr key={Transaction.transactionID}>
        <td>{Transaction.transactionDate.substr(0, 10)}</td>
        <td>{Transaction.group}</td>
        <td>{Transaction.text}</td>
        <td>{Transaction.transactionMethod}</td>
        <td>{Transaction.category}</td>
        <td>{Transaction.location}</td>
        <td>{Transaction.amount}</td>
        <td>
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
              {this.state.TransactionInfo.Balance}{" "}
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
        <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Group</th>
                <th>Text</th>
                <th>Transaction Type</th>
                <th>Category</th>
                <th>Location</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.createTransactionRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Dashboard;
