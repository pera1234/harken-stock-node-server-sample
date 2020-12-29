import path, { join } from 'path';
import logger from '../../logger';
import { config } from 'dotenv';

export class AppConfig {
  private _envVars!: string;

  public constructor() {
    const envPath: string = path.join(__dirname, '../resources', `.env.${process.env.NODE_ENV || 'development'}`);

    try {
      config({ path: envPath });

      logger.info(`Environment variable resources: ${envPath}`);

      this.envVars = this.filteredVars();
      logger.info(this.envVars);
    } catch (error) {
      logger.error('Unable to set environment variables', error);
    }
  }

  public filteredVars(): string {
    return JSON.stringify(
      process.env,
      (k, v) => {
        if (k === k.toUpperCase()) {
          return v;
        }
      },
      2,
    );
  }

  public get envVars() {
    return this._envVars;
  }

  public set envVars(envVars: string) {
    this._envVars = envVars;
  }
}
