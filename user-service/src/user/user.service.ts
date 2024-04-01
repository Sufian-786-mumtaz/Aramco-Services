import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ADMIN_ROLE } from '@constants/schemas.contants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  filterAllUsersByStatus(status: string): Promise<User[]> {
    return this.userModel.find({ status });
  }

  findUserById(userId: string): Promise<User> {
    return this.userModel.findOne({ _id: userId }).exec();
  }

  findUserByFilter(filter: any): Promise<User> {
    return this.userModel.findOne(filter);
  }

  findAllEmployees(): Promise<User[]> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'department',
        },
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true, 
        },
      },
      {
        $match: {
          $or: [
            { department: { $exists: true } },
            { department: null },
          ],
          $and: [{role: {$ne: ADMIN_ROLE}}]
        },
      },
    ]).exec();
  }
  

  createUser(authDtoSignUp: any): Promise<User> {
    return this.userModel.create(authDtoSignUp);
  }

  findOneAndUpdate(filter: any, body: any): Promise<User> {
    return this.userModel.findByIdAndUpdate(filter, body, { new: true });
  }

  findOneAndDelete(userId: string): Promise<User> {
    return this.userModel.findOneAndDelete({ _id: userId });
  }
}
