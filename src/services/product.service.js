import ProductDao from "../dao/product.dao.js";

class ProductService {

  getProductsQuery = async (limit, page, sort, query) => {
    return await ProductDao.getProductsQuery(limit, page, sort, query);
  }

  getProducts = async () => {
    return await ProductDao.getProducts();
  }

  getProductById = async (idProducto) => {
    return await ProductDao.getProductById(idProducto);
  }

  addProduct = async (datosProducto) => {
    return await ProductDao.addProduct(datosProducto);
  }

  updateProduct = async (idProducto, nuevosDatosProducto) => {
    return await ProductDao.updateProduct(idProducto, nuevosDatosProducto);
  }

  deleteProduct = async (idProducto) => {
    return await ProductDao.deleteProduct(idProducto);
  }

}

export default new ProductService();
