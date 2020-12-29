import express from 'express';
import asyncHandler from 'express-async-handler';
import { AdminController } from '../controllers/admin';

const router = express.Router();
const adminController = new AdminController();

router.get(
  '/status',
  asyncHandler(async (req, res) => {
    const status = await adminController.getDbStatus(req, res);
    res.status(200).json(status);
  }),
);

export default router;
