import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  avatar_url: { type: DataTypes.TEXT },
  country: { type: DataTypes.STRING(100), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  timestamps: false
});

export default User;
