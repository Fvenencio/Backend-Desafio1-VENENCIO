import express from "express";
import productsRouter from "./src/routers/products.js";
import Handlebars  from "express-handlebars";
import cartsRouter from "./src/routers/carts.js";
import viewsRouter from "./src/routers/views.js";
import { Server } from "socket.io";
import ProductManager from "./src/managers/productsmanager.js";
import fs from "fs";
import path from "path";

const store = new ProductManager('./src/db/products.json', 'products');
const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => {
  console.log("El servidor esta corriendo en el puerto ", PORT);
});

const socketServer = new Server(httpServer);
app.engine("handlebars", Handlebars.engine());
app.set("views", path.resolve('views'));
app.set("view engine", "handlebars");
app.use(express.static(path.resolve('public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

socketServer.on("connection", async (socket) => {
  console.log("Nuevo Cliente conectado");
  const products = await store.getProducts();
  console.log(products)
  socket.emit("products", products);
  
 socket.on("addProduct", (newProduct) => {
  const filePath = path.resolve('data', 'products.json');
 
  fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error("Error al leer el archivo 'products.json':", err);
    return;
  }

  const products = JSON.parse(data);
  products.push(newProduct);
  const updatedData = JSON.stringify(products);

  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error("Error al escribir en el archivo 'products.json'");
        return;
      }
      console.log("Nuevo producto agregado exitosamente");
    });
  socketServer.emit("productAdded", newProduct);
  });
});
});


export default socketServer;