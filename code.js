const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const API_KEY = "YOUR_IBM_CLOUD_API_KEY";

function getToken() {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.onload = () => {
      try {
        resolve(JSON.parse(req.responseText));
      } catch (err) {
        reject("Failed to parse token response");
      }
    };

    req.onerror = () => reject("Token request failed");

    req.open("POST", "https://iam.cloud.ibm.com/identity/token");
    req.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    req.setRequestHeader("Accept", "application/json");

    req.send(
      "grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY
    );
  });
}

function scoreModel(token) {
  const scoring_url =
    "https://private.au-syd.ml.cloud.ibm.com/ml/v4/deployments/019e936c-2eff-74ba-9f5a-ca4ff2384642/predictions?version=2021-05-01";

  const payload = JSON.stringify({
    input_data: [
      {
        fields: [
          "feature1",
          "feature2",
          "feature3"
        ],
        values: [
          [10, 20, 30]
        ]
      }
    ]
  });

  const req = new XMLHttpRequest();

  req.onload = () => {
    try {
      const result = JSON.parse(req.responseText);
      console.log("Prediction Result:");
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error("Failed to parse prediction response");
    }
  };

  req.onerror = () => {
    console.error("Prediction request failed");
  };

  req.open("POST", scoring_url);
  req.setRequestHeader("Authorization", "Bearer " + token);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader("Accept", "application/json");

  req.send(payload);
}

getToken()
  .then((tokenData) => {
    scoreModel(tokenData.access_token);
  })
  .catch((err) => {
    console.error(err);
  });