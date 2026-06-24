const { DataTypes } = require("sequelize");
const sequelize = require("./Database");

module.exports = sequelize.define("Account",
  {
    id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:    { type: DataTypes.STRING },
    balance: { type: DataTypes.DECIMAL(10, 2) },
  },
  { tableName: "accounts", timestamps: false }
);