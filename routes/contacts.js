const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');
const verifyToken = require('../middleware/auth');

// GET /api/admin/contacts  — protected
router.get('/', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ success: false, error: 'Server error while fetching contacts.' });
  }
});

// DELETE /api/admin/contacts/:id  — protected
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }
    res.json({ success: true, message: 'Submission deleted successfully.' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ success: false, error: 'Server error while deleting submission.' });
  }
});

module.exports = router;
