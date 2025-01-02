let { DataTypes, sequelize } = require("../lib/index");
let { Supplier } = require("./Supplier");

let Product = sequelize.define("product", {
  name: DataTypes.STRING,
  supplierId: {
    type: DataTypes.INTEGER,
    references: {
      model: Supplier,
      key: "id",
    },
  },
  description: DataTypes.STRING,
  quantityInStock: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
});

// Define associations
Product.belongsTo(Supplier, {
  foreignKey: {
    name: "supplierId",
    allowNull: false,
  },
});
Supplier.hasMany(Product, { foreignKey: "supplierId" });

module.exports = {
  Product,
};
