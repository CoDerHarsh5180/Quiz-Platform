import { Router }             from 'express';
import { verifyStudentJWT }  from '../../middleware/studentAuth.middleware.js';
import {
  studentRegister,
  studentVerifyOtp,
  studentLogin,
  studentLogout,
  studentRefreshToken,
  studentGetProfile,
  studentChangePassword,
} from '../../controllers/student.controller.js';

const router = Router();

// ── Public routes ──────────────────────────────────────────────────────────────
router.route('/register').post(studentRegister);          // Step 1 – send OTP
router.route('/register/verify-otp').post(studentVerifyOtp);  // Step 2 – verify OTP & create account
router.route('/login').post(studentLogin);
router.route('/refresh-token').post(studentRefreshToken);

// ── Protected routes ───────────────────────────────────────────────────────────
router.route('/logout').post(verifyStudentJWT, studentLogout);
router.route('/profile').get(verifyStudentJWT, studentGetProfile);
router.route('/change-password').post(verifyStudentJWT, studentChangePassword);

export default router;

