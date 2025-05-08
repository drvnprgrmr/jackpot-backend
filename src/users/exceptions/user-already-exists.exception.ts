import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(
      { code: '1-1', message: 'User already exists!' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
