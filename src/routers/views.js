import { Router } from "express";
import ProductManager from "../managers/productsmanager.js";
const router = Router();
const manager = new ProductManager("./src/db/iphones.json", 'iphones');

router.get(("/"), async (req, res)=>{
    const products = await manager.getProducts();
    res.render("home", {products});
})

router.get("/realtimeproducts", async (req, res) => {
  const products = await manager.getProducts();
  res.render("realTimeProduct", { products });
});


export default router;