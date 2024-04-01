// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51OyW8kFeO7aw5wH94zmD7uVAHDdl4nDA20QyglMPicPVn88yPcKSEcUhBRyUe6fx2fFdRmHc0eG3b3DzO7u1pPB900LFzBrFJP"
);
const express = require("express");
const router = express();

router.post("/create-checkout-session", async (req, res) => {
  const product = await stripe.products.create({
    name: req.body.product,
  });

  if (product) {
    var price = await stripe.prices.create({
      product: `${product?.id}`,
      unit_amount: req.body.amount * 100,
      currency: "inr",
    });
  }
  if (price.id) {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price.id,
          quantity: 1,
        },
      ],
      customer_email: "codesense24@gmail.com",
      mode: "payment",
      return_url: `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`,
    });
    console.log(session);
    return res.send({ clientSecret: session.client_secret });
  }
});

router.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  console.log(session);
  return res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

module.exports = router;
