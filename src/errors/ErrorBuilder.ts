import {AxiosResponse} from 'axios';
import {InternalError} from './InternalError';
import {NotFoundError} from './NotFoundError';

export class ErrorBuilder {
  private readonly response: AxiosResponse;

  private constructor(response: AxiosResponse) {
    this.response = response;
  }

  public static forResponse(response: AxiosResponse): ErrorBuilder {
    return new ErrorBuilder(response);
  }

  public build(message?: string): Error {
    const exceptionMessage = (defaultMessage: string) => {
      return message || this.response.data || defaultMessage;
    };

    switch (this.response.status) {
      case 404:
        return new NotFoundError(exceptionMessage('Requested entity could not be found'));
      case 500:
      default:
        return new InternalError(exceptionMessage('An internal error has occurred'));
    }
  }
}
