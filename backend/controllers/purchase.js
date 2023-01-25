const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require('../models/user');
require("dotenv").config();

exports.purchasepremium = (req, res, next) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });
    var options = {
      amount: 1000,
      currency: "INR",
      receipt: "ABC",
    };

    instance.orders.create(options, (err, order) => {
      if (err) {
        throw new Error(err);
      }
      res.json({ order, key_id: instance.key_id });
    });
  } catch (err) {
    res.status(403).json({ message: "Something went wrong!" });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    let order = await Order.create({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      status: "success",
      userId: req.user._id
    });
    if (order.status == 'success') {
      let user = await User.findById(req.user._id);
      console.log('user>>>', user)
      user.ispremiumuser = true;
      await user.save();
      let updatedUser = await User.findById(req.user._id);
      console.log('updatedUser>>', updatedUser)

      res.status(200).json({ message: "Successfully saved!" });
    };
  } catch (err) {
    res.status(403).json({ error: err, message: "Something went wrong!" });
  };
};
