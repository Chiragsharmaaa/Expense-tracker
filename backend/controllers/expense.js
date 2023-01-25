const Expense = require("../models/expense");
const User = require("../models/user");
const Downloadurl = require("../models/downloadurl");
const S3Services = require("../services/S3services");

exports.postAddExpense = async (req, res, next) => {
  const { amount, description, category } = req.body;

  try {
    const data = await Expense.create({
      amount,
      description,
      category,
      userId: req.user._id
    });
    res.status(201).json({ data, message: "expense added!" });
  } catch (err) {
    res.status(500).json({ message: "Cannot add Expense!" });
  };
};

exports.getExpenses = async (req, res, next) => {
  let page = req.params.pageno || 1;
  let ITEMS_PER_PAGE = +req.body.itempsperpage || 2;
  let totalItems;
  try {
    let totalExpenses = await Expense.find().count();
    totalItems = totalExpenses;

    let data = await Expense.find({ userId: req.user.id }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    res.status(200).json({
      data,
      info: {
        currentPage: page,
        hasNextPage: totalItems > page * ITEMS_PER_PAGE,
        hasPreviousPage: page > 1,
        nextPage: +page + 1,
        previousPage: +page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "unable to load expenses!" });
  };
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    let expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found!' });
    }
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json('Unauthorized!');
    }
    await Expense.findByIdAndRemove(expenseId);
    res.status(200).json({ message: "Successfully deleted Expense!" });
  } catch (err) {
    res.status(500).json({ message: "Cannot delete Expense!" });
  };
};

exports.getAllUserExpenses = async (req, res, next) => {
  try {
    if (req.user.ispremiumuser) {
      const leaderboard = [];
      let users = await User.find().select('id name email');

      for (let i = 0; i < users.length; i++) {
        let expenses = await Expense.find({ userId: users[i]._id });
        let totalExpense = 0;
        for (let j = 0; j < expenses.length; j++) {
          totalExpense += expenses[j].amount;
        };
        let userObj = {
          user: users[i],
          expenses,
          totalExpense
        }
        console.log(userObj)
        leaderboard.push(userObj);
      };
      return res.status(200).json({ success: true, data: leaderboard });
    };
    return res.status(400).json({ message: "user is not a premium user" });
  } catch (err) {
    res.status(500).json({ success: false, data: err });
  };
};

exports.downloadExpense = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId });
    const stringifyExpense = JSON.stringify(expenses);
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadtoS3(stringifyExpense, fileName);
    const downloadURLData = await Downloadurl.create({
      fileName,
      fileUrl: fileURL,
      userId: req.user._id
    });
    res.status(200).json({ fileURL, downloadURLData, success: true });
  } catch (error) {
    res.status(500).json({ fileURL: "", success: false, err: error });
  };
};

exports.getAlldownloadURL = async (req, res, next) => {
  try {
    let urls = await Downloadurl.find({ userId: req.user._id });
    if (!urls) {
      res.status(404).json({ message: "no urls found!", success: false });
    }
    res.status(200).json({ urls, success: true });
  } catch (error) {
    res.status(500).json({ error });
  };
};
