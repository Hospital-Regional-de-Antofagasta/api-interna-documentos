const Documentos = require("../models/Documentos");

exports.create = async (req, res) => {
  try {
    const documento = req.body;
    await Documentos.create(documento);
    res.sendStatus(201);
  } catch (error) {
    console.log(`Documentos create: ${error.name} - ${error.message}`)
    res.status(500).send({
      respuesta: `Documentos create: ${error.name} - ${error.message}`,
    });
  }
};
