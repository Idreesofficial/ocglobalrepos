import express from 'express';
import { updateLogo, getLogo } from '../controllers/settingsController.js';

const router = express.Router();

router.put('/logo', updateLogo);
router.get('/logo', getLogo);

export default router;