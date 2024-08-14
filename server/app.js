require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51PnGNsCTCAvA9YejQ71VaRWvyh0khJ3YJBwvkgXSnurcAlQjSdEX1RdscWbhTB7O8MqhvPRmmniNjvgPtyxF4nPr00wqlICQzL"); // Use environment variable for security

app.use(express.json());
app.use(cors());

// checkout api
app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const { products } = req.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr", // Make sure this currency is supported
                product_data: {
                    name: product.dish,
                    images: [product.imgdata], // Ensure imgdata is a valid URL
                },
                unit_amount: product.price * 100,
            },
            quantity: product.qnty,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(7000, () => {
    console.log("Server started on port 7000");
});
