const Documentos = require("../models/DocumentosOld");

exports.create = async (req, res) => {
  console.log("Documentos old create");
  try {
    const documentos = req.body;
    console.log("Cantidad documentos", documentos.length);
    if (documentos.length === 0) {
      console.log("Documentos old create finish");
      return res.sendStatus(201);
    }
    const filter = documentos[0].tipo === "DAU" ? "DAU" : "EPICRISIS";
    const documentosBD = await Documentos.find({ filter }).exec();

    for (let documento of documentos) {
      if (
        !documentosBD.find(
          (documentoBD) =>
            documentoBD.correlativo === documento.correlativo &&
            documentoBD.tipo === documento.tipo
        )
      ) {
        await Documentos.create(documento);
        console.log("Documento creado");
      }
    }
    console.log("Documentos old create finish");
    return res.sendStatus(201);
  } catch (error) {
    console.log(`Error documentos old create: ${error.name} - ${error.message}`)
    res.status(500).send({
      respuesta: `Documentos create: ${error.name} - ${error.message}`,
    });
  }
};
