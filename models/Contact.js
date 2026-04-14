import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  service: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;
