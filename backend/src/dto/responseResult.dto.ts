export class ResponseResultDto<T> {
  statusCode: number;
  message: string;
  data: T;

  constructor(code: number, message: string, data = null) {
    this.statusCode = code;
    this.message = message;
    this.data = data;
  }
}
