import {ApiClient} from './ApiClient';
import {ErrorBuilder} from '../errors/ErrorBuilder';

export abstract class AbstractCommand<T> {
  protected readonly api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  protected abstract exec(): Promise<T>;

  readonly execute = async (): Promise<T> => {
    try {
      return await this.exec();
    } catch (error) {
      if (error.response) {
        throw ErrorBuilder.forResponse(error.response).build();
      }
      throw error;
    }
  };
}
