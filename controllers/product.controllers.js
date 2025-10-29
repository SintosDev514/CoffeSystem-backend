import mongoose from 'mongoose';
import Product from '../models/product.model.js';

export const getProducts =  async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error fetching products", error.message);
    res.status(404).json({ success: false, message: "failed searching" });
  }
}

export const createProduct = async (req, res) => {
    console.log("👉 Incoming data:", req.body);

  const product = req.body; // user will send this data

  if (!product.name || !product.price || !product.image || !product.category) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required data" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in creating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product Deleted" });
  } catch (error) {
    console.log("Error deleting products", error.message);
    res.status(500).json({ succsess: false, message: "Server Error" });
  }
}