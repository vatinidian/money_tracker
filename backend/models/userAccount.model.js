const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAccountSchema = new Schema(
  {
    user: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      required: true,
    },
    accountBalance: { type: Number, required: true },
  },
  { timestamps: true }
);

const userAccount = mongoose.model("userAccount", userAccountSchema);
module.exports = userAccount;
