const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let income = [];
let expense = [];

function calculateTotals(data) {
  let totalIncome = 0;
  let totalExpense = 0;

  data.income.forEach(item => {
    totalIncome += item.amount;
  });

  data.expenses.forEach(item => {
    totalExpense += item.amount;
  });

  let balance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    balance
  };
}

const dataFile = path.join(__dirname, "data.json");


function readData() {
  if (!fs.existsSync(dataFile)) {
    return { income: [], expenses: [] };
  }
  const data = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2))
}


app.get("/", (req, res) => {
  res.send("Money Manager Backend Running");
});

// app.post("/add-income", (req, res) => {
//   const { amount, description } = req.body;
//   const data = readData();
//   data.income.push({
//     amount: Number(amount),
//     description: description
//   });
  
//   writeData(data);
//   // console.log("BODY:", req.body);
//   res.json({ message: "Income added successfully" });
// });

app.post("/income", (req, res) => {
  const { amount, description } = req.body;

  income.push({ amount, description });
  res.json({ message: "Income added" });
  });

app.post("/expense", (req, res) => {
  const { amount, description } = req.body;

  expense.push({ amount, description });
  res.json({ message: "Expense added" });
  });

app.get("/transactions", (req, res) => {
  res.json({
  income: income,
  expense: expense
});
});

app.get("/balance", (req, res) => {
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpense = expense.reduce((sum, e) => sum + Number(e.amount), 0);

  res.json({
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  });
});
app.post("/reset", (req, res) => {
  writeData({ income: [], expenses: [] });
  res.json({ message: "All Data Cleared Successfully" });
});
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});
// console.log("Data file path",dataFile);
// console.log("Server directory:",__dirname);

