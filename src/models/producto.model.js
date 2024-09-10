import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productoSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: String,
    required: true,
    default: 0
  },
  categoria: {
    type: String,
    required: true
  },
  destacado: {
    type: Boolean,
    default: false
  },
  activo: {
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

productoSchema.plugin(mongoosePaginate);

const ProductoModel = mongoose.model("productos", productoSchema);

export default ProductoModel;
