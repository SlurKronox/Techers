import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const View = sequelize.define('View', {
  view_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  video_id: { type: DataTypes.INTEGER, allowNull: false },
  viewed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  watch_seconds: { type: DataTypes.INTEGER, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'views',
  timestamps: false
});

export default View;
    