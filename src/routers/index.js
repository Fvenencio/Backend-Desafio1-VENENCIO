import { Router } from "express";
import api_router from "./api.js";

const index_router = Router();

index_router.get('/', (req, res) => {
    res.send('<h1>Hola mundo</h1>');
});

export default index_router;