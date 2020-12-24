var express = require("express");
var router = express.Router();

const Razorpay = require("razorpay");
const request = require("request");

const keys = require("../keys");

const razorInstance = new Razorpay({
  key_id: keys.razorIdKey,
  key_secret: keys.razorIdSecret,
});

router.post("/order", (req, res) => {
  const amount = req.body.amount;
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 0, //1
    };
    razorInstance.orders.create(options, async function (err, order) {
      if (err) {
        return res.status(500).json({
          message: "Something error!s",
        });
      }
      return res.status(200).json(order);
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something error!s",
    });
  }
});

router.post("/capture/:paymentId", (req, res) => {
  const amount = req.body.amount;
  console.log();
  try {
    return request(
      {
        method: "POST",
        url: `https://${keys.razorIdKey}:${keys.razorIdSecret}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
        form: {
          amount: amount * 100,
          currency: "INR",
        },
      },
      async function (err, response, body) {
        if (err) {
          return res.status(500).json({
            message: "Something error!s",
          });
        }
        return res.status(200).json(body);
      }
    );
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
