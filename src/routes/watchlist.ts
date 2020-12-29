import express from 'express';
import asyncHandler from 'express-async-handler';
import logger from '../../logger';
import { AuthService } from '../services/auth';
import { WatchListController } from './../controllers/watchlist';

const router = express.Router();
const watchListController = new  WatchListController();
const authService = new AuthService();

router.get('/', asyncHandler(async(req, res, next) => {
  try {
    await authService.verifyToken(req, res, next);
    await watchListController.getWatchLists(req, res);
  } catch (error) {
    logger.error(`Unable to get watchlists: ${error}`);
    res.status(401).json({ message: 'Unauthorized' });
  }

}));

router.post('/', asyncHandler(async (req, res, next) => {
    try {
      await authService.verifyToken(req, res, next);
      await watchListController.addWatchList(req, res);
    } catch (error) {
      logger.error(`Unable to add watchlist: ${error}`);
      res.status(401).json({ message: 'Error',  error: `${error}`});
    }
  }),
);

router.put('/', asyncHandler(async (req, res, next) => {
  logger.info(`Update watchlist:`);
    await authService.verifyToken(req, res, next);
    const updateResult = await watchListController.updateWatchList(req, res);
    res.status(200).json(updateResult);
}));

router.delete('/:id', asyncHandler(async (req, res, next) => {
    await authService.verifyToken(req, res, next);
    const deleteResult = await watchListController.deleteWatchList(req, res);
    res.status(200).json(deleteResult);
}));

export default router;