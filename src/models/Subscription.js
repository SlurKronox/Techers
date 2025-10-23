import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Subscription = sequelize.define('Subscription', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  channel_id: { type: DataTypes.INTEGER, primaryKey: true },
  subscribed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  notifications_enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'subscription',
  timestamps: false
});

export default Subscription;
