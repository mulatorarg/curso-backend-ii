import { Router } from "express";
import { passportCall } from "../util/util.js";
import ViewsController from "../controller/views.controller.js";

const router = Router();

/** Renderizar vista de todos los productos */
router.get("/", ViewsController.index);

/** Renderizar vista de los productos destacados */
router.get("/destacados", ViewsController.destacados);

/** Renderizar vista de los productos según categoría */
router.get("/categorias/:category", ViewsController.porcategoria);

/** Renderizar vista de inicio de sesión */
router.get("/login", ViewsController.login);

/** Renderizar vista de regsitro de usuario */
router.get("/register", ViewsController.register);

/** Renderizar vista de información de que el usuario no tiene los permisos para acceder al recurso */
router.get("/sinpermisos", ViewsController.sinpermiso);

/** Renderizar vista de ABM en tiempo real (uso de websockets) */
router.get("/realtimeproducts", passportCall("jwt"), ViewsController.realtimeproducts);

/** Renderizar vista del carrito actual del usuario */
router.get("/cart", passportCall("jwt"), ViewsController.showCart);

/** Renderizar vista de datos del producto seleccionado */
router.get("/product/:producto_id", passportCall("jwt"), ViewsController.showProduct);

/** Renderizar vista de compra de producto seleccionado */
router.get("/purchase/:producto_id", passportCall("jwt"), ViewsController.addProductToCart);

/** Renderizar vista de compra de producto seleccionado */
router.get("/finishcart", passportCall("jwt"), ViewsController.finishCart);

export default router;
