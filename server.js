require("dotenv").config()
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const cors=require("cors")

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

const data=[]

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('appqzmYk6pQwf1HEh');



app.get("/products",(req,res)=>{
  base('products').select({
      view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
     
  
      records.forEach(function(record) {
        data.push({id:record.id,...record.fields})
          console.log('Retrieved', record.fields);
      });
  
      fetchNextPage();
  
  }, function done(err) {
      if (err) { console.error(err); return; }
  });
  res.send(data)
})
app.get("/products/:id",(req,res)=>{
base('products').find(req.params.id, function(err, record) {
    if (err) { console.error(err); return; }
    res.send({id:record.id,...record.fields})
});
})
app.get("/config",(req,res)=>{
  res.send({publishableKey:process.env.STRIPE_PUBLIC_KEY})
})

const calculateOrderAmount = (items,fee) => {
  let amount=0;
  items.map(i=>{
    amount+=i.amount*i.price;
  })
  return amount+fee;
};
app.get("/create-payment-intent",(req,res)=>{
  res.send("hi")
})

app.post("/create-payment-intent", async (req, res) => {
   const {cart,shipping_fee}=((req.body));
  
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(cart,shipping_fee),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  console.log(paymentIntent);
  res.send({
    client_secret: paymentIntent.client_secret,
    amount:paymentIntent.amount,
  });
});
app.listen(process.env.PORT||4242, () => console.log('Running on port 5252'));