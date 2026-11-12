import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const studentSchema = new Schema({
  name:         { type: String, required: true, trim: true },
  username:     { type: String, required: true, unique: true, trim: true, lowercase: true, minlength: 3 },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:     { type: String, required: true, select: false },
  refreshToken: { type: String },

  examTypes: [{ type: String, index: true }],

}, { timestamps: true });


// ── Hash password before save ──────────────────────────────────────────────────
studentSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// ── Instance methods ───────────────────────────────────────────────────────────
studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id:      this._id,
      name:     this.name,
      username: this.username,
      email:    this.email,
    },
    process.env.JSON_ACCESS_TOKEN,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

studentSchema.methods.generateRefreshToken = async function () {
  try {
    return jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  } catch (e) {
    console.log(e);
  }
};

export const Student = mongoose.model('Student', studentSchema);
