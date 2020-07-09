import {AxiosResponse} from 'axios';
import {InternalError} from './InternalError';
import {NotFoundError} from './NotFoundError';
import {UpsError, UpsErrorDetails} from './UpsError';

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
      return message || this.response.data?.message || defaultMessage;
    };

    const getErrorDetails = (): UpsErrorDetails => {
      return this.response.data?.details || {};
    };

    let error: UpsError;

    switch (this.response.status) {
      case 404:
        error = new NotFoundError(exceptionMessage('Requested entity could not be found'), getErrorDetails());
        break;
      case 500:
      default:
        error = new InternalError(exceptionMessage('An internal error has occurred'), getErrorDetails());
    }
    return error;
  }
}
