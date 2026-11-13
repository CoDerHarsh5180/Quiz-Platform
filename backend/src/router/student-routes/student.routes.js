import { Router }             from 'express';
import { verifyJWTStudent }  from '../../middleware/studAuth.middleware.js';
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
router.route('/logout').post(verifyJWTStudent, studentLogout);
router.route('/profile').get(verifyJWTStudent, studentGetProfile);
router.route('/change-password').post(verifyJWTStudent, studentChangePassword);

export default router;

