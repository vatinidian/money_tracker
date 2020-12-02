const router = require("express").Router();
let userAccountModel = require("../models/userAccount.model");

router.route("/checkAccount/:user").get((req, res, next) => {
    userAccountModel.findOne(
      {
        user: req.params.user
      },
      function(oError, user) {
        if (oError) {
          next(oError);
        }
        if (!user) {
          res.json({
            status: 404,
            statusText: "User Info Not found"
          });
        } else {
          res.json({
            status: "200",
            ...user._doc
          });
        }
      }
    );
  });

router.route("/add").post((req, res) => {
  const user = req.body.user || "DUMMY";
  const accountBalance = Number(req.body.accountBalance) || 0;

  const newUserAccountInfo = new userAccountModel({
    user,
    accountBalance
  });

  newUserAccountInfo
    .save()
    .then(() => res.json("New User account Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update").put((req, res) => {
    const user = req.body.user || "DUMMY";
    const accountBalance = Number(req.body.accountBalance) || 0;

    userAccountModel.findOneAndUpdate({user:user}, {accountBalance : accountBalance},{new: true}, function (err, userAccount) {
        res.send(userAccount);
      });
  });

module.exports = router;
