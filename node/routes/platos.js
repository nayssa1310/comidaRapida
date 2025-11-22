
const express = require("express");
const router = express.Router();
const { getPlatos, crearPlato } = require("../controllers/platosController");

router.get("/", getPlatos);
router.post("/", crearPlato);

module.exports = router;
