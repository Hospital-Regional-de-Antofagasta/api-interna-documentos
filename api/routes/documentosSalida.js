const express = require("express");
const documentosSalidaController = require("../controllers/documentosSalidaController");
const { isAuthenticated } = require("../middleware/auth");
const { requiredParameters } = require("../middleware/validarDocumento");

const router = express.Router();

router.post(
  "",
  isAuthenticated,
  documentosSalidaController.create
);

router.put(
  "",
  isAuthenticated,
  documentosSalidaController.updateMany
);

router.delete(
  "",
  isAuthenticated,
  documentosSalidaController.deleteMany
);

module.exports = router;
