import { Schema, model, Document } from 'mongoose';

export interface IMediaLog extends Document {
  userId: number;
  videoContentId: number;
  catenoidKey: string;
  action: 'play' | 'pause' | 'seek' | 'stop' | 'complete' | 'buffer';
  watchedSeconds: number;
  totalDuration: number;
  progressPercent: number;
  userAgent: string;
  ipAddress: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const MediaLogSchema = new Schema<IMediaLog>(
  {
    userId: { type: Number, required: true, index: true },
    videoContentId: { type: Number, required: true, index: true },
    catenoidKey: { type: String, required: true, index: true },
    action: {
      type: String,
      enum: ['play', 'pause', 'seek', 'stop', 'complete', 'buffer'],
      required: true,
    },
    watchedSeconds: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    progressPercent: { type: Number, default: 0 },
    userAgent: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'media_logs',
  },
);

MediaLogSchema.index({ userId: 1, videoContentId: 1, createdAt: -1 });

export const MediaLog = model<IMediaLog>('MediaLog', MediaLogSchema);
export { MediaLogSchema };
