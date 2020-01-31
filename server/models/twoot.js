module.exports = (sequelize, DataTypes) => {
  return sequelize.define('twoots', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    author_id: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.STRING
    },
    img_name: {
      type: DataTypes.TEXT
    },
    parent_twoot: {
      type: DataTypes.STRING
    },
    hashtags: {
      type: DataTypes.ARRAY(DataTypes.STRING)
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
