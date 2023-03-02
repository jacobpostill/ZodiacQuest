const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
class FriendRequest extends Model {}


FriendRequest.init(
{
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
  }
},    
{
    sequelize,
    timestamps: true,
    // prevent pluralisation
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
});

module.exports = FriendRequest;