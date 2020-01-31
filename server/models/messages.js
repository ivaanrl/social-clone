module.exports = Message = sequelize.define('message', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'id'
  },
  from_id: {
    type: Sequelize.STRING
  },
  to_id: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.TEXT
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
