const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register (for demo/test only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = mockData.users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `user${mockData.users.length + 1}`,
      name,
      email,
      password: hashedPassword,
      role: 'user'
    };

    mockData.users.push(newUser);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'fallbacksecret', {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = mockData.users.find(u => u.email === email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallbacksecret', {
        expiresIn: '7d'
      });

      return res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;