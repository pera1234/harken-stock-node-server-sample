import { ErrorCode } from './error-code';

export class BaseError extends Error {
  public readonly name: string;
  public readonly status: string;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(errorCode: ErrorCode, status: string) {
    super(errorCode.toString());
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = errorCode.toString();
    this.status = status;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this);
  }
}
