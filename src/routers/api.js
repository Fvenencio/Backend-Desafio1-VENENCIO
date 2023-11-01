import { Router } from "express";
import products_router from "./products.js";
import carts_router from "./carts.js";

const api_router = Router();

api_router.use("/products", products_router);
api_router.use("/carts", carts_router);

export default api_router;