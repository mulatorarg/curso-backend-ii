import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  important: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  thumbnails: {
    type: [String],
    required: true
  },
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
