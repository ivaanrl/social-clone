//const sequelize = require('../config/postgres.config');
//const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('follows', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    follower_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
};
