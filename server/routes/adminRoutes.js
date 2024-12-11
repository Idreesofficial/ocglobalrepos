import express from 'express';
import {
  addAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  verifyAdmin
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/', addAdmin);
router.get('/', getAllAdmins);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.post('/verify', verifyAdmin);

export default router;