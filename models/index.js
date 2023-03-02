const User = require('./User');
const FriendRequest = require('./friend');

/// const Project = require('./Project');

// User.hasMany(Project, {
//   foreignKey: 'user_id',
//   onDelete: 'CASCADE'
// });

// Project.belongsTo(User, {
//   foreignKey: 'user_id'
// });

// Various database relationships go here
module.exports = { User, FriendRequest
  //Project 
};
