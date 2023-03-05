const User = require('./User');
const GameData = require('./GameData');
const Achievement = require('./Achievement');
const Comment = require('./Comment');

User.hasMany(GameData, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

User.hasOne(Achievement, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

User.hasMany(Comment, {
  foreignKey: 'recipient_id',
  onDelete: 'CASCADE'
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Achievement.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

GameData.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
   });

Comment.belongsTo(User, {
  foreignKey: 'recipient_id',
  onDelete: 'CASCADE'
   });

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

// Various database relationships go here
module.exports = { User, GameData, Achievement, Comment};
