import React, { Component } from "react";
import Axios from "axios";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";
import "./App.css";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      decription: "",
      amount: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  razorPayPaymentHandler = async () => {
    const API_URL = `http://localhost:7000/razorpay/`;
    const orderUrl = `${API_URL}order`;
    const response = await Axios.post(orderUrl, { amount: this.state.amount });
    const { data } = response;
    console.log("App -> razorPayPaymentHandler -> data", data);

    const options = {
      key: "",//replace razorpay API key
      name: this.state.name,
      description: this.state.decription,
      order_id: data.id,
      handler: async (response) => {
        try {
          const paymentId = response.razorpay_payment_id;
          console.log(paymentId);
          const url = `http://localhost:7000/razorpay/capture/${paymentId}`;
          const captureResponse = await Axios.post(url, {
            amount: this.state.amount,
          });
          const successObj = JSON.parse(captureResponse.data);
          const captured = successObj.captured;
          console.log("App -> razorPayPaymentHandler -> captured", successObj);
          if (captured) {
            swal("Payment Successfull", "", "success");
            console.log("success");
            this.setState({
              name: "",
              decription: "",
              amount: "",
            });
          }
        } catch (err) {
          console.log(err);
        }
      },
      theme: {
        color: "#686CFD",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  _getData = () => {
    return this.state.name;
  };

  render() {
    return (
      <div className="App-header">
        <div>
          <Card style={{ width: 500, height: 400 }}>
            <TextField
              id="outlined-basic"
              label="Enter Name"
              variant="outlined"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              required
              style={{ width: 300, marginTop: 70, marginLeft: 90 }}
            />
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              name="decription"
              value={this.state.decription}
              onChange={this.handleChange}
              required
              style={{ width: 300, marginTop: 20, marginLeft: 90 }}
            />
            <TextField
              id="outlined-basic"
              label="Enter Amount"
              variant="outlined"
              name="amount"
              value={this.state.amount}
              onChange={this.handleChange}
              required
              style={{ width: 300, marginTop: 20, marginLeft: 90 }}
            />
            <br />
            <br />
            <button
              onClick={this.razorPayPaymentHandler}
              className="btn btn-primary"
              style={{ width: 300, marginLeft: 90 }}
            >
              Pay Now
            </button>
          </Card>
        </div>
      </div>
    );
  }
}

export default App;
