const express = require("express");
const documentosEntradaController = require("../controllers/documentosEntradaController");
const { isAuthenticated } = require("../middleware/auth");
const { requiredParameters } = require("../middleware/validarDocumento");

const router = express.Router();

router.get(
  "/solicitudes-envio",
  isAuthenticated,
  requiredParameters,
  documentosEntradaController.getSolicitudesEnvio
);

router.put(
  "/solicitudes-envio",
  isAuthenticated,
  requiredParameters,
  documentosEntradaController.updateSolicitudesEnvio
);

router.delete(
  "/solicitudes-envio",
  isAuthenticated,
  requiredParameters,
  documentosEntradaController.deleteSolicitudesEnvio
);

module.exports = router;
