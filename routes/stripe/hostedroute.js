const express = require("express");
const router = express.Router(); // Use express.Router() for route handling
require("dotenv").config(); // Ensure environment variables are loaded

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const product = await stripe.products.create({
      name: req.body.product_name,
    });

    if (product) {
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: req.body.amount * 100,
        currency: "usd",
      });

      if (price.id) {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: price.id,
              quantity: 1,
            },
          ],
          customer_email: "codesense24@gmail.com", // Consider moving to env variable or request parameter
          mode: "payment",
          success_url: `${process.env.BASE_URL}/hosted/success`,
          cancel_url: `${process.env.BASE_URL}/hosted/cancel`,
        });
        return res.redirect(303, session.url);
      }
    }
  } catch (err) {
    console.error("Error in create-checkout-session:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/success", async (req, res) => {
  try {
    return res.redirect(`${process.env.SUCCESS_REDIRECT_URL}`);
  } catch (error) {
    console.error("Error in success redirect:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/cancel", async (req, res) => {
  try {
    return res.redirect(`${process.env.CANCEL_REDIRECT_URL}`);
  } catch (error) {
    console.error("Error in cancel redirect:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
