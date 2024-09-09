import express from 'express';
import { userLogin, userSignUp } from '../controller/login-controller.js';
import { getDoctor } from '../controller/doctor-controller.js';
import { getUserDetails } from '../controller/details-controller.js';

const router = express.Router();

router.post('/signup',userSignUp);
router.post('/login',userLogin);
router.post('/details',getUserDetails)

router.get('/doctor',getDoctor);

export default router;