import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Channel = sequelize.define('Channel', {
  channel_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
  channel_name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  subscriber_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'channel',
  timestamps: false
});

export default Channel;
