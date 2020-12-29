import express from 'express';
import asyncHandler from 'express-async-handler';
import { IndexController } from '../controllers/index';

const router = express.Router();
const indexController = new IndexController();

router.get(
  '/:name',
  asyncHandler(async (req, res) => {
    indexController.getIndex(req, res);
  }),
);

export default router;
