import {UpsError, UpsErrorDetails} from './UpsError';

export class InternalError extends UpsError {
  constructor(message: string, details: UpsErrorDetails = {}) {
    super('InternalError', message, details);
  }
}
