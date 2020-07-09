import {UpsError, UpsErrorDetails} from './UpsError';

export class NotFoundError extends UpsError {
  constructor(message: string, details: UpsErrorDetails = {}) {
    super('NotFoundError', message, details);
  }
}
