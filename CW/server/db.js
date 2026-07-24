const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({ dialect: 'sqlite', storage: 'db.sqlite', logging: false });

const Search = sequelize.define('Search', {
  artist: DataTypes.STRING,
  country: DataTypes.STRING,
  trackCount: DataTypes.INTEGER,
});

module.exports = { sequelize, Search };