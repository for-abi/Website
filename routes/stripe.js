import express from 'express';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_KEY);

const checkoutLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const webhookLimiter = rateLimit({ windowMs: 60 * 1000, max: 100 });

// Checkout session
router.post('/checkout', checkoutLimiter, async(req,res)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({error:'No token'});
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  try{
    const userId = jwt.verify(token,process.env.JWT_SECRET).id;
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      mode:'subscription',
      line_items:[{price:process.env.STRIPE_PRICE_ID,quantity:1}],
      success_url:`${process.env.SITE_URL}/success.html`,
      cancel_url:`${process.env.SITE_URL}/cancel.html`,
      client_reference_id:userId
    });
    res.json({url:session.url});
  } catch(err){ res.status(401).json({error:'Invalid token'}); }
});

// Webhook — raw body is applied in server.js before express.json()
router.post('/webhook', webhookLimiter, (req,res)=>{
  const event = req.body;
  if(event.type==='checkout.session.completed'){
    const session = event.data.object;
    User.findByIdAndUpdate(session.client_reference_id,{isPremium:true}).exec();
  }
  res.json({received:true});
});

export default router;
