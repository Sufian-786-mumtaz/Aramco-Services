import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret.__v;
    },
  },
})
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;
}

export const RolesSchema = SchemaFactory.createForClass(Role);
