const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");

exports.getSolicitudesEnvio = async (req, res, next) => {
  try {
    const { estado, codigoEstablecimiento } = req.query;
    const filter = { codigoEstablecimiento };

    if (estado) filter.estado = estado;

    const solicitudes = await SolicitudesDocumentos.find(filter)
      .sort({ createdAt: 1 })
      .limit(100)
      .exec();
    res.status(200).send({ respuesta: solicitudes });
  } catch (error) {
    res.status(500).send({
      respuesta: `Solicitud documentos get: ${error.name} - ${error.message}`,
    });
  }
};

exports.updateSolicitudesEnvio = async (req, res, next) => {
  const solicitudesActualizadas = [];
  try {
    const solicitudes = req.body;
    for (let solicitud of solicitudes) {
      try {
        const solicitudMismoIdentificador = await SolicitudesDocumentos.find({
          _id: solicitud._id,
        }).exec();
        // si no existe la solicitud, reportar el error
        if (solicitudMismoIdentificador.length === 0) {
          solicitudesActualizadas.push({
            afectado: solicitud._id,
            realizado: false,
            error: "La solicitud de envío de documento no existe.",
          });
          continue;
        }
        // si existen multiples solicitudes con el mismo rut, indicar el error
        if (solicitudMismoIdentificador.length > 1) {
          solicitudesActualizadas.push({
            afectado: solicitud._id,
            realizado: false,
            error: `Existen ${solicitudMismoIdentificador.length} solicitudes de envío de documento con el identificador ${solicitudes._id}.`,
          });
          continue;
        }
        // si solo se encontro una solicitud para actualizar
        const response = await SolicitudesDocumentos.updateOne(
          {
            _id: solicitud._id,
          },
          solicitud
        ).exec();
        solicitudesActualizadas.push({
          afectado: solicitud._id,
          realizado: response.modifiedCount ? true : false,
          error: response.modifiedCount
            ? ""
            : "La solicitud de envío de documento no fue actualizada.",
        });
      } catch (error) {
        solicitudesActualizadas.push({
          afectado: solicitud._id,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: solicitudesActualizadas,
    });
  } catch (error) {
    res.status(500).send({
      error: `Documentos updateSolicitudesEnvio: ${error.name} - ${error.message}`,
      respuesta: solicitudesActualizadas,
    });
  }
};

exports.deleteSolicitudesEnvio = async (req, res, next) => {
  const solicitudesEliminadas = [];
  try {
    const idSolicitudes = req.body;
    for (let idSolicitud of idSolicitudes) {
      try {
        const solicitudMismoIdentificador = await SolicitudesDocumentos.find({
          _id: idSolicitud,
        }).exec();
        // si no existe la solicitud, reportar el error e indicar que se elimino
        if (solicitudMismoIdentificador.length === 0) {
          solicitudesEliminadas.push({
            afectado: idSolicitud,
            realizado: true,
            error: "La solicitud de envío de documento no existe.",
          });
          continue;
        }
        // si existen multiples solicitudes con el mismo rut, indicar el error
        if (solicitudMismoIdentificador.length > 1) {
          solicitudesEliminadas.push({
            afectado: idSolicitud,
            realizado: false,
            error: `Existen ${solicitudMismoIdentificador.length} solicitudes de envío de documento con el identificador ${idSolicitud}.`,
          });
          continue;
        }
        // si solo se encontro una solicitud para actualizar
        const response = await SolicitudesDocumentos.deleteOne({
          _id: idSolicitud,
        }).exec();
        solicitudesEliminadas.push({
          afectado: idSolicitud,
          realizado: response.deletedCount ? true : false,
          error: response.deletedCount
            ? ""
            : "La solicitud de envío de documento no fue eliminada.",
        });
      } catch (error) {
        solicitudesEliminadas.push({
          afectado: idSolicitud,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: solicitudesEliminadas,
    });
  } catch (error) {
    res.status(500).send({
      error: `Documentos deleteSolicitudesEnvio: ${error.name} - ${error.message}`,
      respuesta: solicitudesEliminadas,
    });
  }
};
