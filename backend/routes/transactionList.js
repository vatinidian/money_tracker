const router = require("express").Router();
let transactionListModel = require("../models/transactionList.model");
let userAccountModel = require("../models/userAccount.model");

router.route("/").get((req, res, next) => {
  let searchFilter = req.query.searchFilter || "";
  let regex = new RegExp(searchFilter, "i");

  let oSearchQuery = searchFilter
    ? {
        $or: [
          { text: regex },
          { category: regex },
          { location: regex },
          { group: regex },
          { transactionMethod: regex },
        ],
      }
    : {};

  delete req.query.searchFilter;
  
  let oFullQuery = {...oSearchQuery, ...req.query};

  transactionListModel
    .find(oFullQuery)
    .collation({ locale: "en" })
    .sort({ transactionDate: -1, group: 1 })
    .then((transactionList) => res.json(transactionList))
    .catch((err) => res.status(400).json("Error: " + err));
});

function updateUserAccount(sUserID, sAmount, res) {
  userAccountModel
    .findOneAndUpdate(
      { user: sUserID },
      { $inc: { accountBalance: +sAmount } },
      { new: true }
    )
    .then(() => {
      return res.json("Transaction added and User Account Balance updated");
    })
    .catch((err) => res.status(400).json("Error: " + err));
}

router.route("/add").post((req, res) => {
  const user = req.body.user || "DUMMY";
  const transactionMethod = req.body.transactionMethod || "DEBIT";
  const category = req.body.category || "MISC";
  const amount = Number(req.body.amount) || 0;
  const group = req.body.group || "";
  const text = req.body.text || "";
  const location = req.body.location || "";
  const transactionDate = Date.parse(req.body.transactionDate);
  const transactionID = req.body.transactionID || "";
  const updateInAccount = req.body.updateInAccount;

  const newtransaction = new transactionListModel({
    user,
    transactionMethod,
    category,
    amount,
    group,
    text,
    location,
    transactionDate,
    transactionID,
    updateInAccount,
  });

  newtransaction
    .save()
    .then(() => {
      if (updateInAccount === true) {
        let iAmountToUpdate = amount;
        if (transactionMethod === "DEBIT") {
          iAmountToUpdate = -amount;
        }
        return updateUserAccount(user, iAmountToUpdate, res);
      } else {
        return res.json("New Transaction Added");
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete").delete((req, res) => {
  let sUserId = req.body.user || "";
  let sTransactionMethod = req.body.transactionMethod;
  let bUpdateInAccount = req.body.updateInAccount;
  let iAmount = req.body.amount || 0;

  transactionListModel.deleteOne(
    { transactionID: req.body.transactionID },
    function (err, transaction) {
      if (err) {
        console.log(err);
      } else {
        if (sUserId && sTransactionMethod && bUpdateInAccount) {
          let iAmountToUpdate = iAmount;
          if (sTransactionMethod === "CREDIT") {
            iAmountToUpdate = -iAmount;
          }
          return updateUserAccount(sUserId, iAmountToUpdate, res);
        } else {
          res.send(transaction);
        }
      }
    }
  );
});

module.exports = router;
