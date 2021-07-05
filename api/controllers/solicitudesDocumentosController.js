const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");

exports.getSolicitudesDocumentos = async (req, res) => {
  try {
    const { estado } = req.query;
    const filter = estado ? { estado } : null;
    const solicitudes = await SolicitudesDocumentos.find(filter)
      .sort({ createdAt: 1 })
      .limit(100)
      .exec();
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
    const solicitud = req.body;
    const filter = { _id: idSolicitud };
    const update = solicitud;
    await SolicitudesDocumentos.updateOne(filter, update).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Solicitud documentos update: ${error.name} - ${error.message}`,
    });
  }
};
