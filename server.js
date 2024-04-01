const express = require("express");
const app = express();
const port = 5002;
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
const bodyParser = require("body-parser");

// Parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Cashfree Route
const hostedroute = require("./routes/stripe/hostedroute");
const embeddedroute = require("./routes/stripe/embedded");
app.use("/hosted", hostedroute);
app.use("/embedded", embeddedroute);

// Starting Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
