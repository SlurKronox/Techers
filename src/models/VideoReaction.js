import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const VideoReaction = sequelize.define('VideoReaction', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  video_id: { type: DataTypes.INTEGER, primaryKey: true },
  reaction: { type: DataTypes.INTEGER, allowNull: false }, // 1 ou -1
  reacted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'video_reaction',
  timestamps: false
});

export default VideoReaction;
