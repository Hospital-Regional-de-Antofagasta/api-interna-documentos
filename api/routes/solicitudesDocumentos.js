const express = require("express");
const solicitudesDocumentosController = require("../controllers/solicitudesDocumentosController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/no-enviadas",
  isAuthenticated,
  solicitudesDocumentosController.getNotSentSolicitudesDocumentos
);

router.put(
  "/:idSolicitud",
  isAuthenticated,
  solicitudesDocumentosController.updateStateSolicitudesDocumentos
);

module.exports = router;
