import jwt               from 'jsonwebtoken';
import { asyncHandler }  from '../utils/asyncHandler.js';
import { ApiError }      from '../utils/ApiError.js';
import { Student }       from '../models/student-models/student.models.js';

export const verifyStudentJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request – no access token');
    }

    const decoded = jwt.verify(token, process.env.JSON_ACCESS_TOKEN);

    const student = await Student.findById(decoded._id).select('-password -refreshToken');
    if (!student) {
      throw new ApiError(401, 'Invalid access token – student not found');
    }

    req.user = student;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});

