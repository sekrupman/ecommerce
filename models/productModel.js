const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      // ref: "Category",
      required:true
    },
    brand: {
      type: String,
      required:true
      // IN CASE NEED ENUM FOR RESTRICT USER INPUT
      // enum:['Black', 'Brown', 'Silver', 'White', 'Blue']
    },
    quantity: { type: Number, required: true },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      required:true
      // IN CASE NEED ENUM FOR RESTRICT USER INPUT
      // enum:['Black', 'Brown', 'Silver', 'White', 'Blue']
    },
    rating: [
      {
        star: Number,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
