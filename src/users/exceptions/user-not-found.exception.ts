import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super({ code: '1-0', message: 'User not found.' }, HttpStatus.BAD_REQUEST);
  }
}
