const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodb");

// CREATE A NEW PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// UPDATE A PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// GET A PRODUCT
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// GET ALL PRODUCT
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // FILTERING
    const queryObj = { ...req.query };
    // DELETE UNUSED FIELDS
    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    // CHANGE QUERY OPERATOR FOR MONGODB
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));
    

    // SORTING
    if(req.query.sort){
        const sortBy = req.query.sort.split(",").join(" ")
        query=query.sort(sortBy)
    }else{
        query = query.sort("-createdAt")
    }

    // LIMITING
    if(req.query.fields){
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields)
    }else{
        query = query.select("-__v")
    }

    // PAGINATION
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numProducts = await Product.countDocuments();
      if (skip >= numProducts) throw new Error("This page does not exist");
    }

    const product = await query;
    res.json(product);

  } catch (error) {
    throw new Error(error);
  }
});

// DELETE A PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
