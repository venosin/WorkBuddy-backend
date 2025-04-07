// Aquí en el controlador irán todos los métodos (CRUD)

const productsController = {};
import productsModel from "../models/Products.js";
import { uploadImage, deleteImage } from "../config/cloudinary.js";
import fs from "fs/promises";
import path from "path";

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
        // Verificar si existe un archivo de imagen en la solicitud
        if (!req.file) {
            return res.status(400).json({ message: "Se requiere una imagen del producto" });
        }
        
        // Obtener la ruta del archivo temporal
        const filePath = req.file.path;
        
        // Subir la imagen a Cloudinary
        const cloudinaryResult = await uploadImage(filePath, 'workbuddy/productos');
        
        // Obtener datos del cuerpo de la solicitud
        const { name, description, category, price, stock } = req.body;
        
        // Crear el objeto de imágenes para guardar en la base de datos
        const imagery = {
            url: cloudinaryResult.url,
            public_id: cloudinaryResult.public_id,
            filename: cloudinaryResult.original_filename || req.file.originalname
        };
        
        // Crear y guardar el nuevo producto
        const newProduct = new productsModel({ 
            name, 
            description, 
            category, 
            price, 
            stock, 
            imagery 
        });
        
        const savedProduct = await newProduct.save();
        
        // Eliminar el archivo temporal después de subirlo a Cloudinary
        await fs.unlink(filePath);
        
        res.status(201).json({ 
            message: "Producto creado con éxito", 
            product: savedProduct 
        });
    } catch (error) {
        console.error(error);
        // Si hay un archivo y ocurre un error, intentamos eliminar el archivo temporal
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error("Error eliminando el archivo temporal:", unlinkError);
            }
        }
        res.status(500).json({ message: "Error creando el producto", error: error.message });
    }
};

// DELETE (Eliminar un producto por ID)
productsController.deleteProduct = async (req, res) => {
    try {
        // Buscar el producto para obtener información sobre la imagen
        const product = await productsModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        // Eliminar la imagen de Cloudinary si existe
        if (product.imagery && product.imagery.public_id) {
            await deleteImage(product.imagery.public_id);
        }
        
        // Eliminar el producto de la base de datos
        await productsModel.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error eliminando el producto", error: error.message });
    }
};

// UPDATE (Actualizar un producto por ID)
productsController.updateProduct = async (req, res) => {
    try {
        // Buscar el producto primero para obtener información sobre la imagen actual
        const existingProduct = await productsModel.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        // Inicializar el objeto de actualización con los datos del body
        const { name, description, category, price, stock } = req.body;
        const updateData = { name, description, category, price, stock };
        
        // Si hay un nuevo archivo de imagen, procesar la actualización de la imagen
        if (req.file) {
            // Subir la nueva imagen a Cloudinary
            const cloudinaryResult = await uploadImage(req.file.path, 'workbuddy/productos');
            
            // Actualizar el campo imagery con la nueva información
            updateData.imagery = {
                url: cloudinaryResult.url,
                public_id: cloudinaryResult.public_id,
                filename: cloudinaryResult.original_filename || req.file.originalname
            };
            
            // Eliminar la imagen anterior de Cloudinary si existe
            if (existingProduct.imagery && existingProduct.imagery.public_id) {
                await deleteImage(existingProduct.imagery.public_id);
            }
            
            // Eliminar el archivo temporal
            await fs.unlink(req.file.path);
        }
        
        // Actualizar el producto en la base de datos
        const updatedProduct = await productsModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        res.json({ 
            message: "Producto actualizado", 
            product: updatedProduct 
        });
    } catch (error) {
        console.error(error);
        // Si hay un archivo y ocurre un error, intentamos eliminar el archivo temporal
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error("Error eliminando el archivo temporal:", unlinkError);
            }
        }
        res.status(500).json({ message: "Error actualizando el producto", error: error.message });
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
