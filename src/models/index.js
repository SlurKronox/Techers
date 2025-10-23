import sequelize from '../database/database.js';
import User from './User.js';
import Channel from './Channel.js';
import Video from './Video.js';
import Comment from './Comment.js';
import Subscription from './Subscription.js';
import View from './View.js';
import ChannelFavorite from './ChannelFavorite.js';
import VideoReaction from './VideoReaction.js';
import CommentLike from './CommentLike.js';

// Relações principais
User.hasMany(Channel, { foreignKey: 'owner_id', onDelete: 'CASCADE' });
Channel.belongsTo(User, { foreignKey: 'owner_id' });

Channel.hasMany(Video, { foreignKey: 'channel_id', onDelete: 'CASCADE' });
Video.belongsTo(Channel, { foreignKey: 'channel_id' });

Video.hasMany(Comment, { foreignKey: 'video_id', onDelete: 'CASCADE' });
Comment.belongsTo(Video, { foreignKey: 'video_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'SET NULL' });

// Tabelas intermediárias
User.belongsToMany(Channel, { through: Subscription, foreignKey: 'user_id', as: 'subscriptions' });
Channel.belongsToMany(User, { through: Subscription, foreignKey: 'channel_id', as: 'subscribers' });

User.belongsToMany(Channel, { through: ChannelFavorite, foreignKey: 'user_id', as: 'favorite_channels' });
Channel.belongsToMany(User, { through: ChannelFavorite, foreignKey: 'channel_id', as: 'favorited_by' });

User.belongsToMany(Video, { through: VideoReaction, foreignKey: 'user_id', as: 'video_reactions' });
Video.belongsToMany(User, { through: VideoReaction, foreignKey: 'video_id', as: 'reacted_users' });

User.belongsToMany(Comment, { through: CommentLike, foreignKey: 'user_id', as: 'liked_comments' });
Comment.belongsToMany(User, { through: CommentLike, foreignKey: 'comment_id', as: 'liked_by' });

export {
  sequelize,
  User,
  Channel,
  Video,
  Comment,
  Subscription,
  View,
  ChannelFavorite,
  VideoReaction,
  CommentLike
};
