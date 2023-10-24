import express from "express";
import { products } from "./products.js";


const app = express();

app.get("/products", (req, res) => {
    const limit = req.query.limit;
  
  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit));
    res.status(200).json(limitedProducts);
  } else {
    res.status(200).json(products);
  }
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

const PORT = 8080;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));