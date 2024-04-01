import {
  ARAMCO_PLATFORM,
  AUDIO_ASSETS,
  AVATAR,
  CONTROLNET_PLATFORM,
  IMAGE,
  IMAGE_ASSETS,
  IMAGE_ATTACHMENT,
  JOB_ASSIGNED,
  JOB_COMPLETED,
  JOB_GENERATING,
  JOB_IN_QUEUE,
  JOB_REJECTED,
  THREE_D_MODEL,
  VIDEO_ASSETS,
  VIDEO_ATTACHMENT,
} from '@constants/schemas.contants';
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

export class Artifacts {
  @Prop({ required: true, enum: [IMAGE_ASSETS, AUDIO_ASSETS, VIDEO_ASSETS] })
  type: String;

  @Prop({ required: true })
  url: String;
}

export class Outputs {
  @Prop({ required: true, enum: [IMAGE_ATTACHMENT, VIDEO_ATTACHMENT] })
  type: String;

  @Prop({ required: true })
  url: String;
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
export class Job {
  @Prop({ required: true })
  description: String;

  @Prop({ default: null, type: Date })
  submissionDate: String;

  @Prop({
    required: true,
    type: [{ type: Artifacts }],
  })
  artifacts: Artifacts[];

  @Prop({ default: [], type: [{ type: Outputs }] })
  outputs: Outputs[];

  @Prop({
    default: JOB_IN_QUEUE,
    enum: [
      JOB_IN_QUEUE,
      JOB_ASSIGNED,
      JOB_COMPLETED,
      JOB_GENERATING,
      JOB_REJECTED,
    ],
  })
  status: String;

  @Prop({ required: true, type: User })
  user: User;
}

export const JobSchema = SchemaFactory.createForClass(Job);
