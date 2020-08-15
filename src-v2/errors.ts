export class AppiumError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    Error.captureStackTrace(this, AppiumError);
    this.name = this.constructor.name;
    this.status = status;
  }
}