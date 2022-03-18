const Documentos = require("../models/DocumentosOld");

exports.create = async (req, res) => {
  try {
    const documentos = req.body;
    for (let documento of documentos) {
      const documentoExistente = await Documentos.findOne({
        correlativo: documento.correlativo,
        tipo: documento.tipo,
      }).exec();
      if (!documentoExistente) {
        await Documentos.create(documento);
      }
    }
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({
      respuesta: `Documentos create: ${error.name} - ${error.message}`,
    });
  }
};