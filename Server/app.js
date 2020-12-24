var express = require("express");
var path = require("path");
const cors = require("cors");
const keys = require("./keys");
const PORT = 7000;

var app = express();

//import Routes
const Razorpay = require("./routes/razorpay.route");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/razorpay", Razorpay);

//listning ports
app.listen(PORT, function () {
  console.log("Server is running on the PORT : " + PORT);
});
