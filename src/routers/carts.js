import { Router } from "express";
import { carritos } from "../../src/controlllers/carts.js";

const carts_router = Router();

carts_router.post("/", async (req, res) => {
  try {
    const cart = await carritos.createCart();
    res.status(201).json({ success: true, response: cart });
  } catch (error) {
    return res.status(500).json({ success: false, response: error });
  }
});

carts_router.get("/", (req, res) => {
  const cart = carritos.getCarts();
  return res.status(200).json({ success: true, response: cart });
});

carts_router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = carritos.getCartById(cid);
  if (typeof cart != "object") {
    return res.status(400).json({ success: false, response: cart });
  }
  return res.status(200).json({ success: true, response: cart });
});

carts_router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.query.quantity) || 1;
    const cart = await carritos.addProductsToCart(cid, { pid, quantity });
    if (typeof cart != "object") {
      return res.status(400).json({ success: false, response: cart });
    }
    return res.status(200).json({ success: true, response: cart });
  } catch (error) {
    return res.status(500).json({ success: false, response: error });
  }
});

carts_router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.query.quantity) || 0;
    const cart = await carritos.deleteProductFromCart(cid, { pid, quantity });
    if (typeof cart != "object") {
      return res.status(400).json({ success: false, response: cart });
    }
    return res.status(200).json({ success: true, response: cart });
  } catch (error) {
    return res.status(500).json({ success: false, response: error });
  }
});

carts_router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await carritos.deleteCart(cid);
    if (cart != "Cart deleted") {
      return res.status(400).json({ success: false, response: cart });
    }
    return res.status(200).json({ success: true, response: cart });
  } catch (error) {
    return res.status(500).json({ success: false, response: error });
  }
});

export default carts_router;