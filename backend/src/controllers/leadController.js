import Lead, { LEAD_SOURCES, LEAD_STATUSES } from '../models/Lead.js';
import mongoose from 'mongoose';

// Validation helper
const validateLeadInput = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      errors.name = 'Name is required';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
  }

  if (!isUpdate || data.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }
  }

  if (!isUpdate || data.phone !== undefined) {
    const phoneRegex = /^[0-9+\s\-().]{7,20}$/;
    if (!data.phone || typeof data.phone !== 'string' || !data.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(data.phone.trim())) {
      errors.phone = 'Please provide a valid phone number (7-20 digits/symbols)';
    }
  }

  if (!isUpdate || data.company !== undefined) {
    if (!data.company || typeof data.company !== 'string' || !data.company.trim()) {
      errors.company = 'Company is required';
    }
  }

  if (!isUpdate || data.source !== undefined) {
    if (!data.source) {
      errors.source = 'Source is required';
    } else if (!LEAD_SOURCES.includes(data.source)) {
      errors.source = `Source must be one of: ${LEAD_SOURCES.join(', ')}`;
    }
  }

  if (!isUpdate || data.status !== undefined) {
    if (!data.status) {
      errors.status = 'Status is required';
    } else if (!LEAD_STATUSES.includes(data.status)) {
      errors.status = `Status must be one of: ${LEAD_STATUSES.join(', ')}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// @desc    Get all leads with search and filter support
// @route   GET /api/leads
export const getLeads = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = {};

    // Filter by status if provided and not "All"
    if (status && status !== 'All' && status.trim() !== '') {
      query.status = status.trim();
    }

    // Search by name (case-insensitive substring) or email
    if (search && search.trim() !== '') {
      const sanitizedSearch = search.trim();
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { email: { $regex: sanitizedSearch, $options: 'i' } },
        { company: { $regex: sanitizedSearch, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID format'
      });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
export const createLead = async (req, res, next) => {
  try {
    const validation = validateLeadInput(req.body, false);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const { name, email, phone, company, source, status } = req.body;

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      source,
      status: status || 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing lead
// @route   PUT /api/leads/:id
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID format'
      });
    }

    const validation = validateLeadInput(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const allowedFields = ['name', 'email', 'phone', 'company', 'source', 'status'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === 'string') {
          lead[field] = req.body[field].trim();
          if (field === 'email') lead[field] = lead[field].toLowerCase();
        } else {
          lead[field] = req.body[field];
        }
      }
    });

    const updatedLead = await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID format'
      });
    }

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};
