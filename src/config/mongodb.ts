import mongoose from 'mongoose';
import logger from '../../logger';
import { ErrorCode } from '../errors/error-code';
import { RuntimeError } from '../errors/runtime-error';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 5000
}

export class MongoDBConfig {
    private mongoDBUrl: string;

    constructor() {
        this.mongoDBUrl = process.env.MONGODB_HOST!;
    }

    public connect() {
        mongoose.connect(this.mongoDBUrl, options)
        .then(() => logger.info(`Connected to ${this.mongoDBUrl}`))
        .catch(error => {
            logger.error(`Database connection error: ${error}`);
            // return new RuntimeError(ErrorCode.DB_CONNECT_FAIL);
        });
    }
}