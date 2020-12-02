const mongoose = require("mongoose");
let autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

const transactionListSchema = new Schema(
  {
    user: { required: true, type: String, trim: true },
    transactionMethod: { required: true, type: String, trim: true },
    category: { type: String, trim: true },
    group: { type: String, trim: true},
    amount: { required: true, type: Number, trim: true, default: 0 },
    transactionDate: { required: true, type: Date },
    text: { type: String },
    location: { type: String },
    updateInAccount: { type: Boolean, required: true, default: true },
    transactionID: { type: Number, unique: true, index: true },
  },
  { timestamps: true }
);

autoIncrement.initialize(mongoose.connection);
transactionListSchema.plugin(autoIncrement.plugin, {
  model: "transactionList",
  field: "transactionID",
  startAt: 101,
});

const transactionList = mongoose.model(
  "transactionList",
  transactionListSchema
);
module.exports = transactionList;
