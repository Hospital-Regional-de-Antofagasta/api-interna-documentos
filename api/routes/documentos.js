const express = require("express");
const documentos = require("../controllers/documentosController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("", isAuthenticated, documentos.create);

module.exports = router;
