import { ERROR, PROCESSING, TRAINED } from '@constants/schemas.contants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class User {
  @Prop({ required: true })
  id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  email: String;

  @Prop({ required: true })
  name: String;
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
export class MediaStorage {
  @Prop({ required: true })
  fileName: string;

  @Prop({})
  description: string;

  @Prop({ required: true })
  url: String;

  @Prop({ type: [{ default: [], type: mongoose.Types.ObjectId, ref: 'Department' }] })
  departmentIds: mongoose.Types.ObjectId[];

  @Prop({ default: false })
  isShareAi: Boolean;

  @Prop({ default: null, enum: [PROCESSING, TRAINED, ERROR] })
  status: String;

  @Prop({ required: true, type: User })
  user: User;
}

export const MediaStorageSchema = SchemaFactory.createForClass(MediaStorage);
