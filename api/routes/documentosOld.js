const express = require("express");
const documentos = require("../controllers/documentosOldController");
const { isAuthenticated } = require("../middleware/authOld");

const router = express.Router();

router.post("", isAuthenticated, documentos.create);

module.exports = router;
