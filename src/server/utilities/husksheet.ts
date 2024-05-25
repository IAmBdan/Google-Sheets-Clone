import axios from "axios";
import qs from "qs";
import base64 from "base-64";
import "dotenv/config";

// Replace these with your actual username and password
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

// Encode the username and password in base64
const auth = base64.encode(`${username}:${password}`);

const endpoint = "https://localhost:9443/api/v1/register";

const requestData = {
  publisher: "examplePublisher",
  sheet: "exampleSheet",
  id: "exampleId",
  payload: "examplePayload",
};

axios
  .post(endpoint, qs.stringify(requestData), {
    headers: {
      'Authorization': `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    console.log("Response:", response.status);
  })
  .catch((error) => {
    if (error.response) {
      console.log("Error response:", error.response);
    } else {
      console.log("Error:", error.response);
    }
  });
