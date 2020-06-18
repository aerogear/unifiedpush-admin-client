import {AxiosResponse} from 'axios';
import {InternalError} from './InternalError';

export class ErrorBuilder {
  private readonly response: AxiosResponse;

  private constructor(response: AxiosResponse) {
    this.response = response;
  }

  public static forResponse(response: AxiosResponse): ErrorBuilder {
    return new ErrorBuilder(response);
  }

  public build(message?: string): Error {
    switch (this.response.status) {
      case 500:
      default:
        return new InternalError(message || 'An internal error has occurred');
    }
  }
}
