import {Router} from 'express';
import { verifyJWTStudent } from '../../middleware/studAuth.middleware.js';
import {getTestAttempt} from '../../controllers/testAttempt.controller.js'

const TestttemptRouter = Router();

TestttemptRouter.route('/attempt').post(verifyJWTStudent, getTestAttempt);
// TestttemptRouter.route('/attempt').post(getTestAttempt);
export default TestttemptRouter;