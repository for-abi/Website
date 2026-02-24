import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Signup
router.post('/signup', async (req,res)=>{
  const {email,password}=req.body;
  const hashed = await bcrypt.hash(password,10);
  try{
    const user = await User.create({email,password:hashed});
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    res.json({token,user});
  } catch(err){ res.status(400).json({error:err.message}); }
});

// Login
router.post('/login', async (req,res)=>{
  const {email,password}=req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(400).json({error:'User not found'});
  const valid = await bcrypt.compare(password,user.password);
  if(!valid) return res.status(400).json({error:'Wrong password'});
  const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
  res.json({token,user});
});

export default router;
