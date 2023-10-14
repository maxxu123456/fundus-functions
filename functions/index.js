/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
var fetch = require("node-fetch");

const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { log } = require("firebase-functions/logger");

initializeApp();

exports.executePayout = onDocumentUpdated("/posts/{postId}", async (event) => {
  randVal = new Date().toString();
  const newValue = event.data.after.data();
  if (newValue.peopleJoined.length >= newValue.minPeople) {
    // logger.log("Confimed Greater");

    // await getFirestore().collection("test").add({ name: "TEST!" });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      "Basic QVN1dDNDdHR2NjVfcnp2Q1RNSTk4T3N4NTNIa3pfd2tqQndNakVWZVhUNUlQZjViV2ItZWozYzNhcDRSRjVGQUxVZ0tSRkxuTi1NRFZIS2U6RU5oSXF4eUpJYVFmUXV1NmpOUG9oSHdXZkRybzB6aEltc2haY3A3bW9kS2ItZzVCeEE2X1U3Smk4bDdQMWx4TWEtSHRIb3o3UDVhQ3JWbnY="
    );
    myHeaders.append(
      "Cookie",
      "datadome=1tWr9veJW2JjoCafcuBR60CWUKM3F3EwEPKzL4g4L_oOp2C0MSglJz37LDqsBkBnPbm0XoSD1wakQMQsdl4trDrOzTUcchfqWF0kbbwZBwgZPtSM1lAcc0__jIdAM71J"
    );

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const accessToken = JSON.parse(result).access_token;
        const payoutId = new Date().toString();
        fetch("https://api-m.sandbox.paypal.com/v1/payments/payouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            sender_batch_header: {
              sender_batch_id: payoutId,
              recipient_type: "EMAIL",
              email_subject: "You have a payout for ",
              email_message:
                "You have received a payout! Thanks for using our service!",
            },
            items: [
              {
                amount: { value: "420", currency: "USD" },
                sender_item_id: "201403140001",
                receiver: "sb-kw2kg27769762@personal.example.com",
                recipient_wallet: "PAYPAL",
              },
            ],
          }),
        }).catch((error) => console.log(error));
      })
      .catch((error) => console.log("error", error));
  }
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
