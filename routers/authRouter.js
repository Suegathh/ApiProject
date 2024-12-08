import express from 'express';
import { signup, signin, signout, sendVerificationCode} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

router.patch('/send-verificationCode', sendVerificationCode);
export default router;