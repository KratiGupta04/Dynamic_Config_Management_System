require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
         try {
                  await mongoose.connect(process.env.MONGODB_URI);
                  console.log('Connected to MongoDB for seeding...');

                  const adminExists = await User.findOne({ username: 'admin' });
                  if (adminExists) {
                           console.log('Admin user already exists.');
                           process.exit(0);
                  }

                  const admin = new User({
                           username: 'admin',
                           password: 'password123'
                  });

                  await admin.save();
                  console.log('Admin user created successfully!');
                  console.log('Username: admin');
                  console.log('Password: password123');
                  process.exit(0);
         } catch (error) {
                  console.error('Error seeding admin:', error);
                  process.exit(1);
         }
};

seedAdmin();
