const Documentos = require("../models/DocumentosOld");

exports.create = async (req, res) => {
  try {
    const documentos = req.body;
    await Documentos.create(documentos);
    res.sendStatus(201);
  } catch (error) {
    console.log(`Documentos create: ${error.name} - ${error.message}`);
    res.status(500).send({
      respuesta: `Documentos create: ${error.name} - ${error.message}`,
    });
  }
};