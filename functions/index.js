const functions = require("firebase-functions");
// const firebase = require("firebase-admin/app");
const express = require("express");
const request = require("request");

const app = express();


app.get("/", (req, res) => {
  res.send("Karen Provision Stores");
});
app.get("/access_token", access, (req, res) => {
  res.status(200).json({access_token: req.access_token});
});

app.get("/register", access, (req, resp)=>{
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  const token = req.access_token;
  const authorise = "Bearer"+" "+ token;

  request(
      {
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorise,
        },
        json: {
          "ShortCode": 600584,
          "ResponseType": "Completed",
          "ConfirmationURL": "https://us-central1-intergration-firebase.cloudfunctions.net/app/confirmation",
          "ValidationURL": "https://us-central1-intergration-firebase.cloudfunctions.net/app/validation",
        },

      },
      function(error, response, body) {
        if (error) {
          console.log(error);
        } else {
          resp.status(200).json(body);
        }
      },
  );
});

app.post("/validation", (req, res) =>{
  console.log(".........validation............");
  console.log(req.body);
  res.status(200).json({
    "ResuiltCode": 0,
    "ResuiltDesc": "Success",
  });
});

app.post("/confirmation", (req, res) => {
  console.log(".........confirmation............");
  const data = req.body;
  console.log(data);
  res.status(200).json({
    "ResuiltCode": 0,
    "ResuiltDesc": "Success",
  });
});


app.get("/simulate", access, (req, res) => {
  // res.send("simulate works");
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
  const tokenn = req.access_token;
  const authority = "Bearer"+" "+ tokenn;

  request(
      {
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authority,
        },
        json: {
          "ShortCode": 600584,
          "CommandID": "CustomerBuyGoodsOnline",
          "amount": "1",
          "MSISDN": "254705912645",
          "BillRefNumber": "",
        },

      },
      function(error, response, body) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json(body);
        }
      },
  );
});

app.get("/testPage", (req, res) => {
  res.send("Karen Provision Stores");
});

// eslint-disable-next-line require-jsdoc
function access(req, res, next) {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  // eslint-disable-next-line max-len
  const auth = "Basic NzZONHo4VnNRTnRCM0JwR09taGVpd3pjR0s1UDkwNlE6ZVFJUzVtSk1vN24wWUtxWg";
  request(
      {
        url: url,
        headers: {
          "Authorization": auth,
        },
      },
      (error, response, body)=>{
        if (error) {
          console.log(error);
        } else {
          req.access_token = JSON.parse(body).access_token;
          next();
        }
      },
  );
}


exports.app = functions.https.onRequest(app);
