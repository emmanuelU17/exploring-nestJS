import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomDuplicateException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
