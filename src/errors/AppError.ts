class AppError {
  public readonly message: string | string[];
  public readonly statusCode: number;

  constructor(message: string | string[], statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
