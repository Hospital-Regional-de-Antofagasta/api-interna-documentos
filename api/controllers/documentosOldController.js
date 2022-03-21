const Documentos = require("../models/DocumentosOld");

exports.create = async (req, res) => {
  try {
    const documentos = req.body;
    if (documentos.length === 0) {
      return res.sendStatus(400);
    }
    for (let documento of documentos) {
      const documentoBD = await Documentos.find({
        correlativo: documento.correlativo,
        tipo: documento.tipo,
      }).exec();
      if (!documentoBD) await Documentos.create(documento);
    }
    return res.sendStatus(201);
  } catch (error) {
    res.status(500).send({
      respuesta: `Documentos create: ${error.name} - ${error.message}`,
    });
  }
};
