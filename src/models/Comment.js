import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Comment = sequelize.define('Comment', {
  comment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  video_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER },
  content: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  likes_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  parent_comment_id: { type: DataTypes.INTEGER },
  is_removed: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'comment',
  timestamps: false
});

export default Comment;
