import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const CommentLike = sequelize.define('CommentLike', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  comment_id: { type: DataTypes.INTEGER, primaryKey: true },
  liked_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'comment_like',
  timestamps: false
});

export default CommentLike;
    