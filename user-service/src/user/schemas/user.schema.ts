import {
  ADMIN_ROLE,
  DIRECTOR_ROLE,
  EMPLOYEE_ROLE,
  MANAGER_ROLE,
  STAFF_ROLE,
  SVP_ROLE,
  UNASSIGN_ROLE,
  USER_ACTIVE,
  USER_INACTIVE,
  USER_ROLE,
  VP_ROLE,
} from '@constants/schemas.contants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret.__v;
    },
  },
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, trim: true, unique: true, immutable: true })
  email: string;

  @Prop({ trim: true })
  password: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({
    default: EMPLOYEE_ROLE,
    enum: [
      USER_ROLE,
      ADMIN_ROLE,
      EMPLOYEE_ROLE,
      SVP_ROLE,
      VP_ROLE,
      DIRECTOR_ROLE,
      MANAGER_ROLE,
      STAFF_ROLE,
      UNASSIGN_ROLE
    ],
  })
  role: string;

  @Prop({
    default: USER_INACTIVE,
    enum: [USER_ACTIVE, USER_INACTIVE],
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Department' })
  department: mongoose.Schema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);