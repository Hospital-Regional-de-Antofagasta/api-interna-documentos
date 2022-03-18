const Documentos = require("../models/DocumentosOld");

exports.create = async (req, res) => {
  try {
    const documentos = req.body;
    if (Array.isArray(documentos)) {
      for (let documento of documentos) {
        const documentoExistente = await Documentos.findOne({
          correlativo: documento.correlativo,
          tipo: documento.tipo,
        }).exec();
        if (!documentoExistente) await Documentos.create(documento);
      }
    } else {
      const documentoExistente = await Documentos.findOne({
        correlativo: documentos.correlativo,
        tipo: documentos.tipo,
      }).exec();
      if (!documentoExistente) await Documentos.create(documentos);
    }
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({
      respuesta: `Documentos create: ${error.name} - ${error.message}`,
    });
  }
};