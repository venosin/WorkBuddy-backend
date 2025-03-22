// Aquí en el controlador irán todos los métodos (CRUD)

const productsController = {};
import productsModel from "../models/Products.js";

// SELECT (Obtener todos los productos)
productsController.getProducts = async (req, res) => {
    try {
        const products = await productsModel.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo los productos" });
    }
};

// INSERT (Crear un nuevo producto)
productsController.createProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock, imagery } = req.body;
        const newProduct = new productsModel({ name, description, category, price, stock, imagery });
        await newProduct.save();
        res.json({ message: "Producto creado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creando el producto" });
    }
};

// DELETE (Eliminar un producto por ID)
productsController.deleteProduct = async (req, res) => {
    try {
        await productsModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error eliminando el producto" });
    }
};

// UPDATE (Actualizar un producto por ID)
productsController.updateProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock, imagery } = req.body;
        const updateProduct = await productsModel.findByIdAndUpdate(
            req.params.id,
            { name, description, category, price, stock, imagery },
            { new: true }
        );
        res.json({ message: "Producto actualizado", product: updateProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error actualizando el producto" });
    }
};

// SELECT PRODUCT BY ID (Obtener un producto por ID)
productsController.getProduct = async (req, res) => {
    try {
        const product = await productsModel.findById(req.params.id);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo el producto" });
    }
};

export default productsController;

// const Product = require("../models/Product");
// const { validationResult } = require("express-validator");

// // Get all products
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error getting products");
//   }
// };

// // Get product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ msg: "Product not found" });
//     }
//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     if (error.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Product not found" });
//     }
//     res.status(500).send("Server error");
//   }
// };

// // Create new product
// exports.createProduct = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, description, price, stock, category, image } = req.body;

//   try {
//     const newProduct = new Product({
//       name,
//       description,
//       price,
//       stock,
//       category,
//       image,
//     });

//     const product = await newProduct.save();
//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error creating product");
//   }
// };

// // Update product
// exports.updateProduct = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, description, price, stock, category, image } = req.body;
//   const productFields = {};
//   if (name) productFields.name = name;
//   if (description) productFields.description = description;
//   if (price) productFields.price = price;
//   if (stock !== undefined) productFields.stock = stock;
//   if (category) productFields.category = category;
//   if (image) productFields.image = image;

//   try {
//     let product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ msg: "Product not found" });
//     }

//     product = await Product.findByIdAndUpdate(
//       req.params.id,
//       { $set: productFields },
//       { new: true }
//     );

//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     if (error.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Product not found" });
//     }
//     res.status(500).send("Server error");
//   }
// };

// // Delete product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ msg: "Product not found" });
//     }

//     await Product.findByIdAndRemove(req.params.id);
//     res.json({ msg: "Product removed" });
//   } catch (error) {
//     console.error(error);
//     if (error.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Product not found" });
//     }
//     res.status(500).send("Server error");
//   }
// };

// export default productsController;
