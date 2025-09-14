// seed.js - creates admin, owner, user, stores and ratings
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./src/models/user');
const Store = require('./src/models/store');
const Rating = require('./src/models/rating');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to db for seeding');

  await User.deleteMany({});
  await Store.deleteMany({});
  await Rating.deleteMany({});

  const admin = await User.create({ name: 'Admin User For Test Purpose', email: 'admin@gmail.com', password: 'Admin@1234', role: 'admin' });
  const owner = await User.create({ name: 'Store Owner For Test', email: 'owner@gmail.com', password: 'Owner@1234', role: 'owner' });
  const user = await User.create({ name: 'Normal User For Test', email: 'user@gmail.com', password: 'User@1234', role: 'user' });

  const store1 = await Store.create({ name: 'Happy Mart', email: 'happymart@gmail.com', address: '123 Market Lane', owner: owner._id });
  const store2 = await Store.create({ name: 'Daily Needs', email: 'daily@gmail.com', address: '45 2nd Street', owner: owner._id });

  await Rating.create({ user: user._id, store: store1._id, rating: 4 });
  await Rating.create({ user: user._id, store: store2._id, rating: 5 });

  console.log('Seeding done');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
