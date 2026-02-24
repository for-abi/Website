import express from 'express';
import OpenAI from 'openai';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Auth middleware
const auth = async (req,res,next)=>{
  const token = req.headers.authorization;
  if(!token) return res.status(401).json({error:'No token'});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch(err){ res.status(401).json({error:'Invalid token'});}
}

// AI generator
router.post('/', auth, async (req,res)=>{
  const {type,prompt}=req.body;
  try{
    if(type==='text'){
      const response = await openai.chat.completions.create({
        model:'gpt-4',
        messages:[{role:'user',content:prompt}],
        max_tokens:400
      });
      res.json({result:response.choices[0].message.content});
    } else if(type==='image'){
      const response = await openai.images.generate({
        model:'dall-e-3',
        prompt:prompt,
        size:'1024x1024'
      });
      res.json({result:response.data[0].url});
    }
  }catch(err){ res.status(500).json({error:err.message}); }
});

export default router;
