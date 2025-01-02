let express = require("express");
let { sequelize } = require("./lib/index.js");
let { Category } = require("./models/Category.js");
let { Product } = require("./models/Product.js");
let { ProductCategory } = require("./models/ProductCategory.js");
let { Supplier } = require("./models/Supplier.js");
const { Op } = require("sequelize");
const cors = require("cors");

let app = express();
app.use(express.json());
app.use(cors());

// Endpoint to seed database
app.get("/seed_db", async (req, res) => {
  await sequelize.sync({ force: true });

  //Given Data
  const suppliersData = [
    {
      name: "TechSupplies",
      contact: "John Doe",
      email: "contact@techsupplies.com",
      phone: "123-456-7890",
    },
    {
      name: "HomeGoods Co.",
      contact: "Jane Smith",
      email: "contact@homegoodsco.com",
      phone: "987-654-3210",
    },
  ];

  const productsData = [
    {
      name: "Laptop",
      description: "High-performance laptop",
      quantityInStock: 50,
      price: 120099,
      supplierId: 1,
    },
    {
      name: "Coffee Maker",
      description: "12-cup coffee maker",
      quantityInStock: 20,
      price: 45000,
      supplierId: 2,
    },
  ];

  const categoriesData = [
    { name: "Electronics", description: "Devices and gadgets" },
    {
      name: "Kitchen Appliances",
      description: "Essential home appliances for kitchen",
    },
  ];

  const suppliers = await Supplier.bulkCreate(suppliersData);

  const products = await Product.bulkCreate(productsData);

  const categories = await Category.bulkCreate(categoriesData);

  return res.json({ message: "Database seeded!" });
});

//Functions to get suppliers, products and categories respectively based on id.

async function getSupplierDetails(supplierId) {
  let supplierDetails = await Supplier.findOne({
    where: { id: supplierId },
  });
  return supplierDetails;
}

async function getProductDetails(productId) {
  let productDetails = await Product.findOne({
    where: { id: productId },
  });
  return productDetails;
}

async function getCategoryDetails(categoryId) {
  let categoryDetails = await Category.findOne({
    where: { id: categoryId },
  });
  return categoryDetails;
}

//Exercise 1: Create a New Supplier

async function addNewSupplier(supplierData) {
  let tempSupplier = {
    name: supplierData.name,
    contact: supplierData.contact,
    email: supplierData.email,
    phone: supplierData.phone,
  };
  let newSupplier = await Supplier.create(tempSupplier);
  let supplierDetails = await getSupplierDetails(newSupplier.id);
  return supplierDetails;
}

app.post("/suppliers/new", async (req, res) => {
  try {
    let newSupplier = req.body.newSupplier;
    let response = await addNewSupplier(newSupplier);
    return res.status(200).json({ newSupplier: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 2: Create a New Product

async function addNewProduct(productData) {
  let tempProduct = {
    name: productData.name,
    description: productData.description,
    quantityInStock: productData.quantityInStock,
    price: productData.price,
    supplierId: productData.supplierId,
  };
  let newProduct = await Product.create(tempProduct);
  let productDetails = await getProductDetails(newProduct.id);
  return productDetails;
}

app.post("/products/new", async (req, res) => {
  try {
    let newProduct = req.body.newProduct;
    let response = await addNewProduct(newProduct);
    return res.status(200).json({ newProduct: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 3: Create a New Category

async function addNewCategory(categoryData) {
  let tempCategory = {
    name: categoryData.name,
    description: categoryData.description,
  };
  let newCategory = await Category.create(tempCategory);
  let categoryDetails = await getCategoryDetails(newCategory.id);
  return categoryDetails;
}

app.post("/categories/new", async (req, res) => {
  try {
    let newCategory = req.body.newCategory;
    let response = await addNewCategory(newCategory);
    return res.status(200).json({ newCategory: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 4: Assign a Product to a Category

async function getProductCategories(productId) {
  let productCategories = await ProductCategory.findAll({
    where: { productId: productId },
  });
  let categories = [];
  for (let i = 0; i < productCategories.length; i++) {
    let categoryDetails = await getCategoryDetails(
      productCategories[i].categoryId,
    );
    categories.push({
      ...categoryDetails.dataValues,
      productCategory: productCategories[i],
    });
  }
  return categories;
}

async function assignProductToCategory(productId, categoryId) {
  let newProductCategory = await ProductCategory.create({
    productId,
    categoryId,
  });
  let productDetails = await getProductDetails(productId);
  let categoriesForProduct = await getProductCategories(productId);
  let productWithCategoriesDetails = {
    ...productDetails.dataValues,
    categories: categoriesForProduct,
  };
  let response = {
    message: "Product assigned to category successfully",
    product: productWithCategoriesDetails,
  };
  return response;
}

app.post(
  "/products/:productId/assignCategory/:categoryId",
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const categoryId = req.params.categoryId;
      let response = await assignProductToCategory(productId, categoryId);
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

//Exercise 5: Get All Products by Category

async function getProductsByCategory(categoryId) {
  let productCategories = await ProductCategory.findAll({
    where: { categoryId },
  });
  let products = [];
  for (let i = 0; i < productCategories.length; i++) {
    let productDetails = await getProductDetails(
      productCategories[i].productId,
    );
    products.push(productDetails);
  }
  return products;
}

app.get("/categories/:id/products", async (req, res) => {
  try {
    const id = req.params.id;
    let response = await getProductsByCategory(id);
    return res.status(200).json({ products: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 6: Update a Supplier

app.post("/suppliers/:id/update", async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplierData = req.body.updateSupplier;
    const updatedSupplier = await Supplier.update(supplierData, {
      where: { id: supplierId },
    });
    let response = await getSupplierDetails(supplierId);
    return res.status(200).json({ updateSupplier: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 7: Delete a Supplier

app.post("/suppliers/:id/delete", async (req, res) => {
  try {
    const supplierId = req.params.id;

    const deletedProduct = await Product.destroy({
      where: { supplierId },
    });

    console.log(`Products deleted = ${deletedProduct}`);

    const deletedSupplier = await Supplier.destroy({
      where: { id: supplierId },
    });

    if (deletedSupplier == 0) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    return res.status(200).json({ message: "Supplier deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 8: Get All Data with Associations

app.get("/suppliers", async (req, res) => {
  try {
    let response = [];
    let suppliers = await Supplier.findAll();
    for (let i = 0; i < suppliers.length; i++) {
      let products = [];
      let productsForSupplier = await Product.findAll({
        where: { supplierId: suppliers[i].id },
      });
      for (let j = 0; j < productsForSupplier.length; j++) {
        let categoriesForProduct = await getProductCategories(
          productsForSupplier[j].id,
        );
        let productWithCategoriesDetails = {
          ...productsForSupplier[j].dataValues,
          categories: categoriesForProduct,
        };
        products.push(productWithCategoriesDetails);
      }
      let supplierDetails = {
        ...suppliers[i].dataValues,
        products: products,
      };
      response.push(supplierDetails);
    }

    return res.status(200).json({ suppliers: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
