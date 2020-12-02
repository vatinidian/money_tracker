const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const localUri = 'mongodb://localhost:27017/money_tracker';
mongoose.connect(localUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true , useFindAndModify: false }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});


const transactionList = require("./routes/transactionList");
app.use("/transactionList", transactionList);

const userAccount = require("./routes/userAccount");
app.use("/userAccount", userAccount);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});