import mongoose from 'mongoose';

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Cold Call',
  'LinkedIn',
  'Email Campaign',
  'Other'
];

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Lost'
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\s\-().]{7,20}$/;

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [emailRegex, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [phoneRegex, 'Please provide a valid phone number (at least 7 digits)']
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [1, 'Company cannot be empty'],
      maxlength: [100, 'Company cannot exceed 100 characters']
    },
    source: {
      type: String,
      required: [true, 'Lead source is required'],
      enum: {
        values: LEAD_SOURCES,
        message: 'Invalid lead source. Allowed values: ' + LEAD_SOURCES.join(', ')
      },
      default: 'Website'
    },
    status: {
      type: String,
      required: [true, 'Lead status is required'],
      enum: {
        values: LEAD_STATUSES,
        message: 'Invalid status. Allowed values: ' + LEAD_STATUSES.join(', ')
      },
      default: 'New'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
leadSchema.index({ name: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
