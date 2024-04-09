const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const CartController = {
    // Get all items in the user's cart
    getCartItems: async (req, res) => {
        try {
            const db = await getDb();
            const collection = db.collection('cart');
            const cartItems = await collection.find({ userId: new ObjectId(req.params.userId) }).toArray();
            res.status(200).json(cartItems);
        } catch (err) {
            res.status(500).json({ message: "Error fetching cart items", error: err.message });
        }
    },

    // Add an item to the cart
    addItemToCart: async (req, res) => {
        try {
            const db = await getDb();
            const arrangementsCollection = db.collection('bcarrangements');
            const cartCollection = db.collection('cart');

            const arrangementId = req.body.arrangementId;
            const quantity = req.body.quantity;

            const arrangement = await arrangementsCollection.findOne({ _id: new ObjectId(arrangementId) });
            if (!arrangement) {
                return res.status(404).json({ message: "Arrangement not found" });
            }

            if (quantity < arrangement.minimumCopies) {
                return res.status(400).json({ message: `You must buy at least ${arrangement.minimumCopies} copies.` });
            }

            await cartCollection.insertOne({
                userId: new ObjectId(req.params.userId),
                arrangementId: new ObjectId(arrangementId),
                quantity: quantity
            });

            res.status(201).json({ message: "Item added to cart successfully" });
        } catch (err) {
            res.status(500).json({ message: "Error adding item to cart", error: err.message });
        }
    },

    // Update the quantity of an item in the cart
    updateCartItem: async (req, res) => {
        try {
            const db = await getDb();
            const arrangementsCollection = db.collection('bcarrangements');
            const cartCollection = db.collection('cart');

            const cartItemId = req.params.id;
            const newQuantity = req.body.quantity;

            const cartItem = await cartCollection.findOne({ _id: new ObjectId(cartItemId) });
            if (!cartItem) {
                return res.status(404).json({ message: "Cart item not found" });
            }

            const arrangement = await arrangementsCollection.findOne({ _id: new ObjectId(cartItem.arrangementId) });
            if (newQuantity < arrangement.minimumCopies) {
                return res.status(400).json({ message: `You must buy at least ${arrangement.minimumCopies} copies.` });
            }

            await cartCollection.updateOne(
                { _id: new ObjectId(cartItemId) },
                { $set: { quantity: newQuantity } }
            );

            res.status(200).json({ message: "Cart item updated successfully" });
        } catch (err) {
            res.status(500).json({ message: "Error updating cart item", error: err.message });
        }
    },

    // Delete an item from the cart
    deleteCartItem: async (req, res) => {
        try {
            const db = await getDb();
            const cartCollection = db.collection('cart');

            const cartItemId = req.params.id;
            const result = await cartCollection.deleteOne({ _id: new ObjectId(cartItemId) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            res.status(200).json({ message: "Cart item deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: "Error deleting cart item", error: err.message });
        }
    }
};

module.exports = CartController;
