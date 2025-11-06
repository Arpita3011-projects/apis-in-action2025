const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

// Register (for demo/test only)
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ success:false, message:'User already exists' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ success:true, data: { id: user._id, name: user.name, email: user.email }, token: generateToken(user._id) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return res.json({ success:true, data:{ id:user._id, name:user.name, email:user.email, role:user.role }, token: generateToken(user._id) });
  }
  res.status(401).json({ success:false, message:'Invalid credentials' });
});