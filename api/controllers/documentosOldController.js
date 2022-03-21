const Documentos = require("../models/DocumentosOld");

exports.create = async (req, res) => {
  return res.sendStatus(503);
  console.log("Documentos old create", new Date());
  try {
    const documentos = req.body;
    console.log("Cantidad documentos", documentos.length);
    if (documentos.length === 0) {
      console.log("Documentos old create finish", new Date());
      return res.sendStatus(201);
    }
    console.log("Tipo documentos", documentos[0].tipo, new Date());
    const filter = documentos[0].tipo === "DAU" ? "DAU" : "EPICRISIS";
    const documentosBD = await Documentos.find({ filter }).exec();

    let cont = 1;
    for (let documento of documentos) {
      console.log("Cantidad documentos revisados", cont, new Date())
      cont ++;
      if (
        !documentosBD.find(
          (documentoBD) =>
            documentoBD.correlativo === documento.correlativo &&
            documentoBD.tipo === documento.tipo
        )
      ) {
        await Documentos.create(documento);
        console.log("Documento creado", new Date());
      }
    }
    console.log("Documentos old create finish", new Date());
    return res.sendStatus(201);
  } catch (error) {
    console.log(`Error documentos old create: ${error.name} - ${error.message}`, new Date())
    res.status(500).send({
      respuesta: `Documentos create: ${error.name} - ${error.message}`,
    });
  }
};
