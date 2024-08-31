const Product = require("../models/productModel");
const asyncHandler =require("express-async-handler")
const slugify = require("slugify")
const validateMongoDbId = require("../utils/validateMongodb");

// CREATE A NEW PRODUCT
const createProduct = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    }catch(error){
        throw new Error(error)
    }
})

// UPDATE A PRODUCT
    const updateProduct = asyncHandler(async (req, res) => {
        const {id} = req.params
        try{
            if(req.body.title){
                req.body.slug = slugify(req.body.title)
            }
            const updateProduct = await Product.findByIdAndUpdate(id, req.body, {new: true})
            res.json(updateProduct)
        }catch(error){
            throw new Error(error)
        }
    })

// GET A PRODUCT
const getProduct = asyncHandler(async (req, res) => {
    const {id} = req.params
    try{
        const findProduct = await Product.findById(id)
        res.json(findProduct)
    }catch(error){
        throw new Error(error)
    }
})

// GET ALL PRODUCT
const getAllProduct = asyncHandler(async (req, res) => {
    try{
        const findAllProduct = await Product.find()
        res.json(findAllProduct)
    }catch(error){
        throw new Error(error)
    }
})

// DELETE A PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params
    try{
        const deleteProduct = await Product.findByIdAndDelete(id)
        res.json(deleteProduct)
    }catch(error){
        throw new Error(error)
    }
})

module.exports = {createProduct, getProduct, getAllProduct, updateProduct, deleteProduct}