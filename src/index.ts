import express from 'express';
import { AppConfig } from './config/app';
import logger from '../logger';
import watchlistroutes from './routes/watchlist';
import userroutes from './routes/user';
import stockroutes from './routes/stock';
import indexroutes from './routes/index';
import adminroutes from './routes/admin';

import { MongoDBConfig } from './config/mongodb';

class StockServerApplication {
  constructor() {
    const appConfig = new AppConfig();
    const mongoConfig = new MongoDBConfig().connect();

    const app = express();

    // CORS handling
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      next();
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    const PORT = process.env.PORT || 9996;

    app.use('/api/watchlist', watchlistroutes);
    app.use('/api/user', userroutes);
    app.use('/api/stock', stockroutes);
    app.use('/api/index', indexroutes);
    app.use('/api/admin', adminroutes);

    app.use((error: any, req: any, res: any, next: any) => {
      logger.error('Error: ' + JSON.stringify(error))
      res.status(error.status).json({ code: `${error.errorCode}`});
    });

    app.listen(PORT, () => logger.info(`Server running on port at: ${PORT}`));
  }
}

const stockServerApplication = new StockServerApplication();
