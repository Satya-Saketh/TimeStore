import cartModel from '../models/cartModel.js';

export const addToCart = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) return res.status(401).json({
            success: false,
            message: "Unauthorised"
        });

        const { productId, quantity, name, img, price, description } = req.body;

        if (!productId || !name || !img || !price) return res.status(400).json({
            success: false,
            message: "All fileds are required"
        });

        const itemPayload = {
            productId,
            name,
            img,
            quantity,
            price,
            qty: quantity,
            description
        }

        let cart = await cartModel.findOne({ user: userId })

        if (!cart) {
            cart = await cartModel.create({ user: userId, items: [itemPayload] });
        } else {
            const idx = cart.items.findIndex((it) => String(it.productId) === String(productId));
            if (idx > -1) cart.items[idx].qty = (Number(cart.items[idx].qty) || 0) + quantity;
            else cart.items.push(itemPayload);
            await cart.save();
        }

        return res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart

        });



    } catch (error) {


        console.error("addToCart Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })

    }
}

export const getCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const cart = (await cartModel.findOne({ user: userId })) || null;
        if (!cart || !cart.items.length) {
            return res.status(200).json({
                success: true,
                cart: { items: [] },
                summary: { totalAmount: 0, tax: 0, shipping: 0, finalAmount: 0 },
            });
        }

        const totalAmount = cart.items.reduce((sum, it) => {
            const p = Number(it.price);
            const q = Number(it.qty) || 0;
            return sum + (Number.isFinite(p) ? p : 0) * q;
        }, 0);

        const taxRate = 0.08;
        const shipping = 0;
        const tax = parseFloat((totalAmount * taxRate).toFixed(2));
        const finalAmount = parseFloat((totalAmount + tax + shipping).toFixed(2));

        return res.status(200).json({
            success: true,
            cart,
            summary: { totalAmount, tax, shipping, finalAmount },
        });
    } catch (error) {
        console.error("getCart error:", error);
        return res.status(500).json({ success: false, message: "Error retrieving cart", error: error.message });
    }
}


export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) return res.status(401).json({
            success: false,
            message: "Unauthorised"
        });

        const { productId, quantity } = req.body;

        if (!productId || !quantity) {

            return res.status(400).json({
                success: false,
                message: "Valid product Id and quantity are required"
            })
        }

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) return res.status(404).json({
            success: false,
            message: "cart not found"
        })

        const idx = cart.items.findIndex((it) => String(it.productId) === String(productId));
        if (idx === -1) return res.status(404).json({ success: false, message: "Item not found in cart." });

        if (quantity === 0) cart.items.splice(idx, 1);
        else cart.items[idx].qty = quantity;

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "cart updated",
            cart
        })



    } catch (error) {

        console.error("getCart error:", error);
        return res.status(500).json({ success: false, message: "Error updating cart", error: error.message });

    }
}

export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) return res.status(401).json({
            success: false,
            message: "Unauthorised"
        });

        const { productId } = req.params;

        if (!productId) return res.status(400).json({
            success: false,
            message: "productId is required"
        })

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) return res.status(404).json({
            success: false,
            message: "cart not found"
        })

        cart.items = cart.item.filter((it)=>String(it.productId) !== String(productId));

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "item removed",
            cart
        })

    } catch (error) {
        console.error("removeFromCart error:", error);
        return res.status(500).json({ success: false, message: "Error in removing cart item", error: error.message });

    }
}

export const clearUserCart = async (req, res) =>{
    try {
        const userId = req.user?._id;

        if (!userId) return res.status(401).json({
            success: false,
            message: "Unauthorised"
        });

        const cart = await cartModel.findOne({user: userId});

        if(!cart) return res.status(200).json({
            success: true,
            message: "Cart is empty already",
            cart: {items: []}

        });

        cart.items = [];

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "cart cleared Successfully!",
            cart
        });
    } catch (error) {
        console.error("clear from Cart error:", error);
        return res.status(500).json({ success: false, message: "Error clearing cart", error: error.message });
        
    }
}