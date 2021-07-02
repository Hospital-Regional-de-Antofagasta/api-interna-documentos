const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");

exports.getNotSentSolicitudesDocumentos = async (req, res) => {
  try {
    const filter = { enviadaHospital: false };
    const solicitudes = await SolicitudesDocumentos.find(filter)
      .sort({ createdAt: 1 })
      .limit(100)
      .exec();

    for (const solicitud of solicitudes) {
      const filter = { _id: solicitud._id };
      const update = { enviadaHospital: true };
      await SolicitudesDocumentos.updateOne(filter, update).exec();
    }
    res.status(200).send(solicitudes);
  } catch (error) {
    res.status(500).send({
      respuesta: `Solicitud documentos get: ${error.name} - ${error.message}`,
    });
  }
};

exports.updateStateSolicitudesDocumentos = async (req, res) => {
  try {
    const idSolicitud = req.params.idSolicitud;
    const { correlativoSolicitud, respondida } = req.body;
    const filter = { _id: idSolicitud };
    const update = { correlativoSolicitud, respondida };
    await SolicitudesDocumentos.updateOne(filter, update).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Solicitud documentos update: ${error.name} - ${error.message}`,
    });
  }
};
