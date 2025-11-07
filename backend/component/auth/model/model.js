const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    contact: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return /^\d{10}$/.test(value);
        },
        message: 'Please provide a valid 10-digit phone number',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    resetOTP: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
    },
    billingAddress: {
      type: String,
    },
    shippingAddress: {
      type: String,
    },
    country1: String,
    country2: String,
    state1: String,
    state2: String,
    city1: String,
    city2: String,
    pincode1: Number,
    pincode2: Number,
    latitude1: { type: Number, default: 0 },
    longitude1: { type: Number, default: 0 },
    latitude2: Number,
    longitude2: Number,
    gstIn: {
      type: String,
    },
    pan: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// const User = mongoose.model('User', userSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;