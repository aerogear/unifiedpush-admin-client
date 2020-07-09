export interface UpsErrorDetails {
  [key: string]: string;
}

export class UpsError extends Error {
  private readonly _details: UpsErrorDetails;

  constructor(name: string, message: string, details: UpsErrorDetails = {}) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    this._details = details || {};

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UpsError);
    }

    this.name = name;
  }

  addDetail(key: string, value: string) {
    this._details[key] = value;
  }

  readonly details = () => ({...this._details});
}
