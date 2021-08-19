const Documentos = require("../models/Documentos");

exports.create = async (req, res) => {
  try {
    const documentos = req.body;
    const hospital = {};
    let propiedad = "";
    if (Array.isArray(documentos)) {
      documentos.forEach((documento) => {
        propiedad = `${documento.numeroPaciente.codigoEstablecimiento}`;
        hospital[propiedad] = 1;
        documento.numeroPaciente.hospital = hospital;
      });
    } else {
      //Sólo un objeto
      propiedad = `${documentos.numeroPaciente.codigoEstablecimiento}`;
      hospital[propiedad] = 1;
      documentos.numeroPaciente.hospital = hospital;
    }
    await Documentos.create(documentos);
    res.sendStatus(201);
  } catch (error) {
    console.log(`Documentos create: ${error.name} - ${error.message}`);
    res.status(500).send({
      respuesta: `Documentos create: ${error.name} - ${error.message}`,
    });
  }
};
