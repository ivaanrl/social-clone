module.exports = (sequelize, DataTypes) => {
  return sequelize.define('fav', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    user_id: {
      type: DataTypes.STRING
    },
    twoot_id: {
      type: DataTypes.STRING
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
