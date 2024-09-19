import ProductModel from "../models/product.model.js";
import { generarClaveAleatoria } from "../util/util.js";

class ProductDao {

  async addProduct({ name, price, stock, category, thumbnails }) {
    try {

      if (!name || !price || !stock || !category) {
        console.log("Todos los campos son obligatorios.");
        return;
      }

      const existeProduct = await ProductModel.findOne({ name: name });

      if (existeProduct) {
        console.log("Ya existe un producto con este código.");
        return;
      }

      const code = generarClaveAleatoria(10);

      const newProduct = new ProductModel({
        code,
        name,
        price,
        stock,
        category,
        active: true,
        thumbnails: thumbnails || ['nuevo.jpeg']
      });

      return await newProduct.save();

    } catch (error) {
      console.log("Error al agregar producto: ", error);
      throw error;
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === 'asc' || sort === 'desc') {
          sortOptions.price = sort === 'asc' ? 1 : -1;
        }
      }

      const products = await ProductModel
        .find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
        nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
      };
    } catch (error) {
      console.log("Error al obtener los productos: ", error);
      throw error;
    }
  }

  //Get product con query, para poder ordenar y filtrar productos.
  getProductsQuery = async (limit, page, sort, category) => {
    try {
      !limit && (limit = 10);
      !page && (page = 1);
      sort === 'asc' && (sort = 1);
      sort === 'des' && (sort = -1);

      const filter = category ? { category: category } : {};
      const queryOptions = { limit: limit, page: page, lean: true };

      if (sort === 1 || sort === -1) {
        queryOptions.sort = { price: sort };
      }

      const getProducts = await ProductModel.paginate(filter, queryOptions);
      getProducts.isValid = !(page <= 0 || page > getProducts.totalPages);
      getProducts.prevLink =
        getProducts.hasPrevPage &&
        `?page=${getProducts.prevPage}&limit=${limit}`;
      getProducts.nextLink =
        getProducts.hasNextPage &&
        `?page=${getProducts.nextPage}&limit=${limit}`;

      getProducts.status = getProducts ? 'success' : 'error';

      return getProducts;
    } catch (error) {
      console.log(error.message);
    }
  };

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);

      if (!product) {
        //console.log("Product no encontrado");
        return null;
      }

      //console.log("Product encontrado!");
      return product;
    } catch (error) {
      console.log("Error al recuprar un producto: ", error);
      return null;
    }
  }

  async updateProduct(id, productUpdated) {
    try {

      const product = await ProductModel.findByIdAndUpdate(id, productUpdated, {returnDocument: 'after'});
      console.log(product);

      if (!product) {
        //console.log("Product no encontrado.");
        return null;
      }

      //console.log("Product actualizado correctamente.");
      return await product.save();
    } catch (error) {
      console.log("Error al actualizar el producto: ", error);
      return null;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await ProductModel.findByIdAndDelete(id);

      if (!product) {
        //console.log("Product no encontrado.");
        return null;
      }

      //console.log("Product eliminado correctamente.");
    } catch (error) {
      //console.log("Error al eliminar el producto.", error);
      throw error;
    }
  }

}

export default new ProductDao();
