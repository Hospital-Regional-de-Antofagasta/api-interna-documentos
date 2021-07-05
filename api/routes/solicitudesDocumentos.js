const express = require("express");
const solicitudesDocumentosController = require("../controllers/solicitudesDocumentosController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get(
  "",
  isAuthenticated,
  solicitudesDocumentosController.getSolicitudesDocumentos
);

router.put(
  "/:idSolicitud",
  isAuthenticated,
  solicitudesDocumentosController.updateStateSolicitudesDocumentos
);

module.exports = router;
