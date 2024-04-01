import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { STATUS_ACTIVE, STATUS_INACTIVE } from '@constants/schemas.contants';
export class Hod {
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: String;

  @Prop({ required: true })
  email: String;
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret.__v;
    },
  },
})
export class Department {
  @Prop({ required: true })
  code: String;

  @Prop({ required: true, unique: true })
  name: String;

  @Prop({ type: Hod })
  hod: Hod;

  @Prop({})
  description: String;

  @Prop({})
  contact_email: String;

  @Prop({ default: STATUS_INACTIVE, enum: [STATUS_ACTIVE, STATUS_INACTIVE] })
  status: String;

  @Prop({ default: null, type: mongoose.Schema.Types.ObjectId, ref: 'Department' })
  parentId: mongoose.Schema.Types.ObjectId;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
