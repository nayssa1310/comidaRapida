
const express = require("express");
const router = express.Router();
const { crearPedido, obtenerPedidoPorId } = require("../controllers/pedidosController");

router.post("/", crearPedido);
router.get("/:id", obtenerPedidoPorId);

module.exports = router;
