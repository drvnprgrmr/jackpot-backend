import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) readonly userModel: Model<User>) {}

  async getUserById(id: Types.ObjectId) {
    const user = await this.userModel.findById(id).exec();

    return user;
  }

  async getUserByIdOrThrow(id: Types.ObjectId) {
    const user = await this.userModel.findById(id).exec();

    if (!user) throw new UserNotFoundException();

    return user;
  }

  async createUser(dto: CreateUserDto) {
    let user = await this.userModel.findOne({ username: dto.username }).exec();

    if (user) throw new UserAlreadyExistsException();

    user = await this.userModel.create(dto);

    return user;
  }
}
