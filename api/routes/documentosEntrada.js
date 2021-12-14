const express = require("express");
const DocumentosEntradaController = require("../controllers/DocumentosEntradaController");
const { isAuthenticated } = require("../middleware/auth");
const { requiredParameters } = require("../middleware/validarDocumento");

const router = express.Router();

router.get(
  "/solicitudes-envio",
  isAuthenticated,
  requiredParameters,
  DocumentosEntradaController.getSolicitudesEnvio
);

router.put(
  "/solicitudes-envio",
  isAuthenticated,
  requiredParameters,
  DocumentosEntradaController.updateSolicitudesEnvio
);

router.delete(
  "/solicitudes-envio",
  isAuthenticated,
  requiredParameters,
  DocumentosEntradaController.deleteSolicitudesEnvio
);

module.exports = router;
