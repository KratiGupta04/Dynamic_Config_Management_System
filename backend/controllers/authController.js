const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
         try {
                  const { username, password } = req.body;

                  if (!username || !password) {
                           return res.status(400).json({ message: 'Username and password are required' });
                  }
                  if (password.length < 4) {
                           return res.status(400).json({ message: 'Password must be at least 4 characters' });
                  }

                  const user = new User({ username, password });
                  await user.save();
                  res.status(201).json({ message: 'User created successfully' });
         } catch (error) {
                  // Duplicate key error (username already taken)
                  if (error.code === 11000) {
                           return res.status(409).json({ message: 'Username already exists. Please choose a different one.' });
                  }
                  res.status(500).json({ message: error.message });
         }
};

exports.login = async (req, res) => {
         try {
                  const { username, password } = req.body;
                  const user = await User.findOne({ username });
                  if (!user || !(await user.comparePassword(password))) {
                           return res.status(401).json({ message: 'Invalid credentials' });
                  }
                  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                  res.json({ token, username: user.username });
         } catch (error) {
                  res.status(500).json({ message: error.message });
         }
};
