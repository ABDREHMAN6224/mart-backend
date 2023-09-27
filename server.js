import dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import productRoutes from "./routes/productsRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import { connection } from "./database/db.js";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import multer from "multer";
import { registerUser } from "./controllers/user.js";
import { addProduct } from "./controllers/products.js";
dotenv.config()
const app = express();
import Stripe from "stripe";
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(path.join(__dirname, "public/")))

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
});

app.post("/auth/register", upload.single("pic"), registerUser)



app.post("/products/addProduct", upload.array("images"), addProduct)


app.use("/auth", userRoutes)
app.use("/products", productRoutes)
app.use("/cart", cartRoutes)

connection()
app.listen(process.env.PORT || 4242, () => console.log('Running on port 4242'));

const data = [];
import Airtable from "airtable";
import Product from "./models/productModel.js";
import { log } from "console";
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appqzmYk6pQwf1HEh');


const getData = async () => {
  const info = await base.table('products').select().all().then(res => (res))
  return info

}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// function arrangeData(info) {
//   const newData = info.map(i => {
//     return { id: i.id, ...i._rawJson.fields }
//   })
//   return newData;
// }
// app.get("/products", async (req, res) => {
//   const info = await getData();
//   const finalData = arrangeData(info);
//   res.send(finalData)
// })
// app.get("/products/:id", (req, res) => {
//   base('products').find(req.params.id, function (err, record) {
//     if (err) { console.error(err); return; }
//     res.send({ id: record.id, ...record.fields })
//   });
// })

app.get("/config", (req, res) => {
  res.send({ publishableKey: process.env.STRIPE_PUBLIC_KEY })
})


const calculateOrderAmount = (items, fee) => {
  let amount = 0;
  items.map(i => {
    amount += i.amount * i.price;
  })
  return amount + fee;
};
app.get("/create-payment-intent", (req, res) => {
  res.send("hi")
})

app.post("/create-payment-intent", async (req, res) => {
  const { cart, shipping_fee } = ((req.body));

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(cart, shipping_fee),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  console.log(paymentIntent);
  res.send({
    client_secret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
  });
});