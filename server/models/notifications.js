module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notifications', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    user_id: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.TEXT
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
