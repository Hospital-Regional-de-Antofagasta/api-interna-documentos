const Documentos = require("../models/DocumentosOld");

exports.create = async (req, res) => {
  console.log("create old")
  try {
    const documentos = req.body;
    console.log("documentos", documentos)
    if (Array.isArray(documentos)) {
      console.log("array")
      for (let documento of documentos) {
        const documentoExistente = await Documentos.findOne({
          correlativo: documento.correlativo,
          tipo: documento.tipo,
        }).exec();
        console.log("documentoExistente", documentoExistente)
        if (!documentoExistente) {
          await Documentos.create(documento);
          console.log("documento creado")
        }
      }
    } else {
      console.log("object")
      const documentoExistente = await Documentos.findOne({
        correlativo: documentos.correlativo,
        tipo: documentos.tipo,
      }).exec();
      console.log("documentoExistente", documentoExistente)
      if (!documentoExistente) {
        await Documentos.create(documentos);
        console.log("documento creado")
      }
    }
    console.log("create old finalizado")
    res.sendStatus(201);
  } catch (error) {
    console.log(`Documentos create: ${error.name} - ${error.message}`);
    res.status(500).send({
      respuesta: `Documentos create: ${error.name} - ${error.message}`,
    });
  }
};