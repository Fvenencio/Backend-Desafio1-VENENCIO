import { Router } from "express";
import { productos } from "../controlllers/products.js";
import { productValidator } from "../middlewares/productvalidator.js";
import { imageUploader } from "../middlewares/multer.js";

const products_router = Router();

products_router.get("/", (req, res) => {
  const limit = req.query.limit;
  const all_products = productos.getProducts();
  if (!all_products) {
    return res
      .status(404)
      .json({ success: false, response: "Algo salió mal" });
  }
  if (limit) {
    return res
      .status(200)
      .json({ success: true, response: all_products.slice(0, limit) });
  }
  res.status(200).json({ success: true, response: all_products });
});

products_router.get("/:id", (req, res) => {
  const id = req.params.id;
  const one_product = productos.getProductById(id);
  res.status(200).json({ success: true, response: one_product });
});

products_router.post("/", productValidator, async (req, res) => {
  try {
    let {
      title,
      description,
      price,
      code,
      category,
      stock,
      status,
      thumbnails,
    } = req.body;

    const product = {
      title,
      description,
      code,
      price: parseFloat(price),
      status,
      stock: parseInt(stock),
      category,
      thumbnails,
    };

    const new_product = await productos.addProduct(product);
    if (typeof new_product != "object") {
      return res.status(400).json({ success: false, response: new_product });
    }

    return res.status(201).json({ success: true, response: new_product });
  } catch (error) {
    return res.status(500).json({ success: false, response: error });
  }
});

products_router.post(
  "/image",
  imageUploader.single("image"),
  productValidator,
  async (req, res) => {
    try {
      let {
        title,
        description,
        price,
        code,
        category,
        stock,
        status,
        thumbnails,
      } = req.body;

      thumbnails.push(req.file.path);
      const product = {
        title,
        description,
        code,
        price: parseFloat(price),
        status,
        stock: parseInt(stock),
        category,
        thumbnails,
      };

      const new_product = await productos.addProduct(product);
      if (typeof new_product != "object") {
        return res.status(400).json({ success: false, response: new_product });
      }

      return res.status(201).json({ success: true, response: new_product });
    } catch (error) {
      return res.status(500).json({ success: false, response: error });
    }
  }
);

products_router.put("/:id", async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;

    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ success: false, response: "Nada para actualizar" });
    }

    const product = await productos.updateProduct(id, data);
    if (typeof product != "object") {
      return res.status(400).json({ success: false, response: product });
    }

    return res.status(200).json({ success: true, response: product });
  } catch (error) {
    return res.status(500).json({ success: false, response: error });
  }
});

products_router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productos.deleteProduct(id);
    if (product != "Producto eliminado") {
      return res.status(400).json({ success: false, response: product });
    }

    return res.status(200).json({ success: true, response: product });
  } catch (error) {
    return res.status(500).json({ success: false, response: error });
  }
});

export default products_router;