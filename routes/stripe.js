import express from 'express';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_KEY);

// Checkout session
router.post('/checkout', async(req,res)=>{
  const {token} = req.headers;
  const userId = jwt.verify(token,process.env.JWT_SECRET).id;

  const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    mode:'subscription',
    line_items:[{price:'YOUR_STRIPE_PRICE_ID',quantity:1}],
    success_url:'YOUR_SITE_URL/success',
    cancel_url:'YOUR_SITE_URL/cancel',
    client_reference_id:userId
  });
  res.json({url:session.url});
});

// Webhook
router.post('/webhook', express.raw({type:'application/json'}),(req,res)=>{
  const event = req.body;
  if(event.type==='checkout.session.completed'){
    const session = event.data.object;
    User.findByIdAndUpdate(session.client_reference_id,{isPremium:true}).exec();
  }
  res.json({received:true});
});

export default router;
