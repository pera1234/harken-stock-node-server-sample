import express from 'express';
import asyncHandler from 'express-async-handler';
import logger from '../../logger';
import { StockController } from '../controllers/stock';

const router = express.Router();
const stockController = new StockController();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    stockController.getStocks(req, res);
  }),
);

router.get(
  '/:symbol',
  asyncHandler(async (req, res) => {
    stockController.getStock(req, res);
  }),
);

router.get(
  '/add',
  asyncHandler(async (req, res) => {
    stockController.addStock(req, res);
  }),
);

router.get(
  '/delete',
  asyncHandler(async (req, res) => {
    stockController.deleteStock(req, res);
  }),
);

router.get(
  '/activity/volume',
  asyncHandler(async (req, res) => {
    stockController.getActivity(req, res);
  }),
);

// admin

router.post(
  '/',
  asyncHandler(async (req, res) => {
    stockController.createStock(req, res);
  }),
);

router.post(
  '/bulk',
  asyncHandler(async (req, res) => {
    try {
      await stockController.loadStockTickers(req, res);
    } catch (error) {
      logger.error(`Unable to load stock tickers: ${error}`);
      res.status(500).json({ type: 'Stock ticker bulk load failed',  error: `${error}`});
    }
  }),
);

// grid

router.post(
  '/grid',
  asyncHandler(async (req, res) => {
    try {
      await stockController.getStockGrid(req, res);
    } catch (error) {
      logger.error(`Unable to get stocks for grid: ${error}`);
      res.status(500).json({ type: 'Error',  error: `${error}`});
    }

  }),
);

// chart
router.post(
  '/chart',
  asyncHandler(async (req, res) => {
    stockController.getStockChart(req, res);
  }),
);

export default router;
