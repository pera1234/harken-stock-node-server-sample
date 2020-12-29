import { BaseError } from './base-error';
import { ErrorCode } from './error-code';

export class RuntimeError extends BaseError {

  constructor(
    errorCode = ErrorCode.INTERNAL_SERVER,
    status = '500'
  ) {
    super(errorCode, status);
  }
}
