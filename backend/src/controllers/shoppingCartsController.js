// Aqui en el controlador iran todos los metodos 
// ( CRUD ) 

import shoppingCartsModel from "../models/shoppingCarts.js";

const shoppingCartsController = {};

// Obtener todos los carritos
shoppingCartsController.getShoppingCarts = async (req, res) => {
    try {
        const carts = await shoppingCartsModel.find()
            .populate('clienteId')
            .populate('products.idProduct')
            .populate('discountCodesId');
        res.json(carts);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los carritos", error: error.message });
    }
};

// Obtener carrito por ID
shoppingCartsController.getShoppingCart = async (req, res) => {
    try {
        const cart = await shoppingCartsModel.findById(req.params.id)
            .populate('clienteId')
            .populate('products.idProduct')
            .populate('discountCodesId');
        
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
    }
};

// Crear nuevo carrito
shoppingCartsController.createShoppingCart = async (req, res) => {
    try {
        const { clienteId, products, discountCodesId, total, state } = req.body;
        const newCart = new shoppingCartsModel({
            clienteId,
            products,
            discountCodesId,
            total,
            state
        });
        await newCart.save();
        res.json({ message: "Carrito creado con éxito", cart: newCart });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message });
    }
};

// Actualizar carrito
shoppingCartsController.updateShoppingCart = async (req, res) => {
    try {
        const { clienteId, products, discountCodesId, total, state } = req.body;
        const updatedCart = await shoppingCartsModel.findByIdAndUpdate(
            req.params.id,
            {
                clienteId,
                products,
                discountCodesId,
                total,
                state
            },
            { new: true }
        ).populate('clienteId')
         .populate('products.idProduct')
         .populate('discountCodesId');

        if (!updatedCart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.json({ message: "Carrito actualizado con éxito", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el carrito", error: error.message });
    }
};

// Eliminar carrito
shoppingCartsController.deleteShoppingCart = async (req, res) => {
    try {
        const deletedCart = await shoppingCartsModel.findByIdAndDelete(req.params.id);
        if (!deletedCart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.json({ message: "Carrito eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el carrito", error: error.message });
    }
};

// Agregar producto al carrito
shoppingCartsController.addProduct = async (req, res) => {
    try {
        const { idProduct, quantity } = req.body;
        const cart = await shoppingCartsModel.findById(req.params.id);
        
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(
            product => product.idProduct.toString() === idProduct
        );

        if (existingProductIndex >= 0) {
            // Actualizar cantidad si el producto ya existe
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Agregar nuevo producto
            cart.products.push({ idProduct, quantity });
        }

        await cart.save();
        res.json({ message: "Producto agregado al carrito", cart });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar producto al carrito", error: error.message });
    }
};

// Remover producto del carrito
shoppingCartsController.removeProduct = async (req, res) => {
    try {
        const { idProduct } = req.body;
        const cart = await shoppingCartsModel.findById(req.params.id);
        
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        cart.products = cart.products.filter(
            product => product.idProduct.toString() !== idProduct
        );

        await cart.save();
        res.json({ message: "Producto removido del carrito", cart });
    } catch (error) {
        res.status(500).json({ message: "Error al remover producto del carrito", error: error.message });
    }
};

export default shoppingCartsController;


/*
He creado el controlador de carritos de compra con las siguientes funcionalidades:

Métodos CRUD básicos:
getShoppingCarts: Obtiene todos los carritos
getShoppingCart: Obtiene un carrito específico por ID
createShoppingCart: Crea un nuevo carrito
updateShoppingCart: Actualiza un carrito existente
deleteShoppingCart: Elimina un carrito

Métodos específicos para gestionar productos:
addProduct: Agrega un producto al carrito
Si el producto ya existe, aumenta la cantidad
Si es nuevo, lo agrega al array de productos
removeProduct: Elimina un producto del carrito

Características importantes:
Uso de populate para mostrar información completa de:
Cliente (clienteId)
Productos (products.idProduct)
Códigos de descuento (discountCodesId)
Manejo de errores con try-catch
Mensajes de respuesta en español
Validación de existencia de carritos
*/