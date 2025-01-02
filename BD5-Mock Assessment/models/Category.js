let { DataTypes, sequelize } = require("../lib/index");

let Category = sequelize.define("categories", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
});

module.exports = {
  Category,
};
