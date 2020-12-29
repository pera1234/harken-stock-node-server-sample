import express from 'express';
import asyncHandler from 'express-async-handler';
import logger from '../../logger';
import { UserController } from '../controllers/user';
import { AuthService } from '../services/auth';

const router = express.Router();
const userController = new UserController();
const authService = new AuthService();

router.post('/register', asyncHandler(async(req, res) => {
  await userController.register(req, res);
}));

router.post('/login', asyncHandler(async(req, res) => {
  await userController.login(req, res);
}));

router.put('/', asyncHandler(async(req, res, next) => {
  await authService.verifyToken(req, res, next);

  const updateUser = await userController.update(req, res);
  res.status(200).json(updateUser);
}));

router.get('/:id', asyncHandler(async(req, res) => {
  userController.getUser(req, res);
}));

router.post('/check', asyncHandler(async(req, res) => {
  userController.userCheck(req, res);
}));

export default router;
