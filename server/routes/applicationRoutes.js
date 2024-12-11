import express from 'express';
import { saveApplication, getAllApplications, deleteApplication } from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', saveApplication);
router.get('/', getAllApplications);
router.delete('/:id', deleteApplication);

export default router;