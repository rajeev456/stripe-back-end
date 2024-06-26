const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors()); // Use CORS
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data

// Import routes
const hostedRoute = require("./routes/stripe/hostedroute");
const embeddedRoute = require("./routes/stripe/embedded"); // Ensure this is also updated for environment handling if needed

// Use routes
app.use("/hosted", hostedRoute);
app.use("/embedded", embeddedRoute);


app.get('/', (req, res) => {
  res.status(200).send('Welcome to my Stripe Backend!');
});

app.use('*', (req, res) => {
  res.status(404).send('Page not found');
});



// Starting Server on port provided by environment or default to 5002 for local development
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
