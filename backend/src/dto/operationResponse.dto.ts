export class OperationResponseDto {
  statusCode: number;
  message: string;
  constructor(code: number, message: string) {
    this.statusCode = code;
    this.message = message;
  }
}
