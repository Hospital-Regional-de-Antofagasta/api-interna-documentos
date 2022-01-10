const express = require("express");
const solicitudesDocumentosController = require("../controllers/solicitudesDocumentosOldController");
const { isAuthenticated } = require("../middleware/authOld");

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  solicitudesDocumentosController.getSolicitudesDocumentos
);

router.put(
  "/:idSolicitud",
  isAuthenticated,
  solicitudesDocumentosController.updateSolicitudesDocumentos
);

router.delete(
  "/:idSolicitud",
  isAuthenticated,
  solicitudesDocumentosController.deleteSolicitudesDocumentos
);

module.exports = router;
