import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const ChannelFavorite = sequelize.define('ChannelFavorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  channel_id: { type: DataTypes.INTEGER, allowNull: false },
  favorited_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'channel_favorite',
  timestamps: false
});

export default ChannelFavorite;
