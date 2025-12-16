const express = require('express');
const {
  submitContact,
  getContactMessages,
  markAsRead,
  deleteContact,
  getUnreadCount
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Contact form validation
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('subject').optional().trim()
];

// Public route for submitting contact form
router.post('/', protect, contactValidation, validate, submitContact);

// Owner-only routes
router.get('/', protect, authorize('owner'), getContactMessages);
router.get('/unread-count', protect, authorize('owner'), getUnreadCount);
router.put('/:id/read', protect, authorize('owner'), markAsRead);
router.delete('/:id', protect, authorize('owner'), deleteContact);

module.exports = router;