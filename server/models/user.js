module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    first_name: {
      type: DataTypes.TEXT
    },
    last_name: {
      type: DataTypes.TEXT
    },
    email: {
      type: DataTypes.TEXT
    },
    username: {
      type: DataTypes.TEXT
    },
    password: {
      type: DataTypes.TEXT
    },
    about: {
      type: DataTypes.TEXT
    },
    profile_pic_name: {
      type: DataTypes.STRING
    },
    cover_pic_name: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.BOOLEAN
    },
    last_login: {
      type: DataTypes.DATE
    }
  });
};
