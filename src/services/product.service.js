import ProductDao from "../dao/product.dao.js";

class ProductService {

  getProductsQuery = async (limit, page, sort, query) => {
    const result = await ProductDao.getProductsQuery(limit, page, sort, query);
    return result
  }

  getProducts = async () => {
    const result = await ProductDao.getProducts();
    return result
  }

  getProductById = async (idProducto) => {
    const result = await ProductDao.getProductById(idProducto);
    return result
  }

  addProduct = async (product) => {
    const result = await ProductDao.addProduct(product);
    return result
  }


  updateProduct = async (idProducto, propertiesToUpdate) => {
    const result = await ProductDao.updateProduct(idProducto, propertiesToUpdate);
    return result
  }

  deleteProduct = async (idProducto) => {
    const result = await ProductDao.deleteProduct(idProducto);
    return result
  }

}

export default new ProductService();
