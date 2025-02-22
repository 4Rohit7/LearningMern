import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

//Loading Environment variables
dotenv.config({ path: './config.env' });

const app = express();
app.set('json spaces', 2);
app.use(express.json());

//Define User Schema & Model

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  password: String,
});

const User = mongoose.model('users', userSchema);

//Connect to MongoDB Atlas

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB, {})
  .then(() => console.log('COnnected to the Database'))
  .catch((err) => console.err('MongoDB Connection Error:'));

//Fetch All Users

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v');
    res.status(200).json({ status: 'Success', result: users.length, users });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Create/Enter Item

app.post('/create', async (req, res) => {
  try {
    const newItem = await User.create(req.body);
    res.status(201).json({ status: 'success', data: newItem });
  } catch (err) {
    res.status(400).json({ statu: 'Fail', message: err.message });
  }
});
/*
//Update Item by _id

app.patch('/update/:id', async (req, res) => {
  try {
    const updatedItem = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ status: 'fail', message: 'No item found' });
    }
    res.status(200).json({ status: 'Success', data: updatedItem });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});
*/

app.patch('/update/:id', async (req, res) => {
  try {
    // Check if the new email already exists
    if (req.body.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res
          .status(400)
          .json({ status: 'fail', message: 'Email already exists' });
      }
    }

    const updatedItem = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ status: 'fail', message: 'No item found' });
    }
    res.status(200).json({ status: 'success', data: updatedItem });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

//Start Server
app.listen(3000, '127.0.0.1', () => {
  console.log('Server has to be started');
});
