import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Video = sequelize.define('Video', {
  video_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  channel_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  views_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  likes_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  dislikes_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  duration_seconds: { type: DataTypes.INTEGER, allowNull: false },
  video_url: { type: DataTypes.TEXT, allowNull: false },
  thumbnail_url: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING(100), defaultValue: '' },
  is_public: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'video',
  timestamps: false
});

export default Video;
