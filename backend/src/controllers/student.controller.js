import jwt from 'jsonwebtoken';

import { Student } from '../models/student-models/student.models.js';
import { Otp } from '../models/otp.models.js';
import sendMail from '../utils/sendEmail.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import redis from '../db/redis.js';


const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const generateOtp = () => {
  const otp = Math.floor(Math.random() * 1_000_000);
  return String(otp).padStart(6, '0');
};

const generateTokens = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(500, 'Student not found');

  const accessToken  = await student.generateAccessToken();
  const refreshToken = await student.generateRefreshToken();

  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const studentRegister = asyncHandler(async (req, res) => {
  console.log('Register request body:', req.body);
  const { name, username, email, password, examTypes } = req.body;
  console.log('Register request body:', req.body);
  if (!name || !username || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedStudent = await Student.findOne({ $or: [{ username }, { email }] });
  if (existedStudent) {
    throw new ApiError(409, 'Student already registered with this username or email');
  }
  console.log('Creating OTP document for email:', email);
  const otp = String(generateOtp());

  console.log('Generated OTP:', otp);
  sendMail(email, otp);
  await redis.setex(`otp:${email}`, 1000, otp);
  console.log('OTP stored in Redis for email:', email);
  return res
    .status(200)
    .json(new ApiResponse(200, { }, 'OTP sent to your email. Please verify to complete registration.'));
});

// ── Register – Step 2: verify OTP and create account ──────────────────────────
const studentVerifyOtp = asyncHandler(async (req, res) => {
  const { name, username, email, password, examTypes, otp } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, 'Email and OTP are required');
  }
  const savedOtp = await redis.get(`otp:${email}`);
 
  if (!savedOtp) {
    throw new ApiError(400, 'OTP not found or expired. Please register again.');
  }

  if (String(savedOtp) !== otp) {
    throw new ApiError(400, 'Invalid OTP');
  }

  await redis.del(`otp:${email}`);
  console.log('OTP verified for email:', email);
  
  const student = await Student.create({
    name:name,
    username: username,
    email: email,
    password: password,
    examTypes: examTypes || [],
  });

  const createdStudent = await Student.findById(student._id).select('-password -refreshToken');
  console.log('Created student:', createdStudent);
  return res
    .status(201)
    .json(new ApiResponse(201, createdStudent, 'Student registered successfully'));
});

// ── Login ──────────────────────────────────────────────────────────────────────
const studentLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, 'Username or email is required');
  }
  if (!password) {
    throw new ApiError(400, 'Password is required');
  }

  const student = await Student.findOne({ $or: [{ email }, { username }] }).select('+password');
  if (!student) {
    throw new ApiError(404, 'Student does not exist');
  }

  const isPasswordValid = await student.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateTokens(student._id);
  const loggedInStudent = await Student.findById(student._id).select('-password -refreshToken');
  console.log('Logged in student:', loggedInStudent);
  return res
    .status(200)
    .cookie('accessToken',  accessToken,  cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, { student: loggedInStudent, accessToken, refreshToken }, 'Logged in successfully'));
});

// ── Logout ─────────────────────────────────────────────────────────────────────
const studentLogout = asyncHandler(async (req, res) => {
  await Student.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie('accessToken',  cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'Logged out successfully'));
});

// ── Refresh Access Token ───────────────────────────────────────────────────────
const studentRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request – no refresh token');
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN);
  } catch (err) {
    throw new ApiError(401, err?.message || 'Invalid refresh token');
  }

  const student = await Student.findById(decoded._id);
  if (!student) {
    throw new ApiError(401, 'Invalid refresh token – student not found');
  }

  if (incomingRefreshToken !== student.refreshToken) {
    throw new ApiError(401, 'Refresh token is expired or already used');
  }

  const { accessToken, refreshToken } = await generateTokens(student._id);

  return res
    .status(200)
    .cookie('accessToken',  accessToken,  cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken, refreshToken }, 'Access token refreshed'));
});

// ── Get Profile ────────────────────────────────────────────────────────────────
const studentGetProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id).select('-password -refreshToken');
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, student, 'Profile fetched successfully'));
});

// ── Change Password ────────────────────────────────────────────────────────────
const studentChangePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'Old and new password are required');
  }

  const student = await Student.findById(req.user._id).select('+password');
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  const isPasswordValid = await student.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Incorrect old password');
  }

  student.password = newPassword;
  await student.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

export {
  studentRegister,
  studentVerifyOtp,
  studentLogin,
  studentLogout,
  studentRefreshToken,
  studentGetProfile,
  studentChangePassword,
};

