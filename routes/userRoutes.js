import express from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


const signUser = (id) => {
  return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: '3d' });
};

// Nodemailer 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yanetyohabeyene@gmail.com',
    pass: 'lghk fped vhac hyle', 
  },
  tls: {
    rejectUnauthorized: false,
  },
});



const router = express.Router();

// Signup 
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Please fill out all fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    
    const verificationNumber = Math.floor(100000 + Math.random() * 900000).toString();

    
    const newUser = new User({
      email,
      username,
      password: await bcrypt.hash(password, 8),  
      isConfirmed: false,  
      verificationNumber,  
    });

    await newUser.save();

    
    const mailOptions = {
      from: 'yanetyohabeyene@gmail.com',
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Hello, <b>${username}</b>! Your verification code is: <b>${verificationNumber}</b>.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email not sent:', err.message);
        return res.status(500).json({ error: 'Failed to send verification email' });
      }
      console.log('Email sent successfully:', info.response);
      return res.status(200).json({ message: 'Verification email sent' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm Email
router.post('/verify-email', async (req, res) => {
  const { email, verificationNumber } = req.body;

  if (!email || !verificationNumber) {
    return res.status(400).json({ error: 'Email and verification number are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.isConfirmed) {
      return res.status(400).json({ error: 'Email already confirmed' });
    }

    if (user.verificationNumber !== verificationNumber) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    user.isConfirmed = true;
    await user.save();

    res.status(200).json({ message: 'Email verified and user confirmed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Login 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill out all fields' });
  }

  try {
   
    const user = await User.findOne({ email });

    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    if (!user.isConfirmed) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

  
    const pass_matches = await bcrypt.compare(password, user.password);
    if (!pass_matches) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    
    const token = signUser(user._id);

    
    res.status(200).json({ user, token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
