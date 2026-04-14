import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Contact from './models/Contact.js';
import authRoutes from './routes/auth.js';
import contactsRoutes from './routes/contacts.js';
import JobRouter from './routes/job.routes.js';
import ApplicationRouter from './routes/application.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Root route
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

// Contact Form Submission Route (public)
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, name, email, phone, service, message } = req.body;
    const resolvedName = fullName || name;

    if (!resolvedName || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide full name, email, and message.' });
    }

    const newContact = new Contact({ fullName: resolvedName, email, phone, service, message });
    await newContact.save();

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ success: false, error: 'Server Error. Please try again later.' });
  }
});

// Admin Routes
app.use('/api/admin', authRoutes);
app.use('/api/admin/contacts', contactsRoutes);

// Career Routes
app.use("/api/jobs", JobRouter);
app.use("/api/applications", ApplicationRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
