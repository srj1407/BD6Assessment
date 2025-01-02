let { DataTypes, sequelize } = require("../lib");
let { Category } = require("./Category");
let { Product } = require("./Product");

let ProductCategory = sequelize.define("productCategory", {
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: "id",
    },
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: "id",
    },
  },
});

Product.belongsToMany(Category, { through: ProductCategory });
Category.belongsToMany(Product, { through: ProductCategory });

module.exports = { ProductCategory };
