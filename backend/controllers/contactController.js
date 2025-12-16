const Contact = require('../models/Contact');

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Private
 */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact messages (Owner only)
 * @route   GET /api/contact
 * @access  Private (Owner only)
 */
const getContactMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    
    let query = {};
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);
    const unreadCount = await Contact.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      unreadCount,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark contact message as read
 * @route   PUT /api/contact/:id/read
 * @access  Private (Owner only)
 */
const markAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete contact message
 * @route   DELETE /api/contact/:id
 * @access  Private (Owner only)
 */
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get unread contact count
 * @route   GET /api/contact/unread-count
 * @access  Private (Owner only)
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Contact.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContactMessages,
  markAsRead,
  deleteContact,
  getUnreadCount
};