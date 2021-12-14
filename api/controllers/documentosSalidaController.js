const Documentos = require("../models/Documentos");

exports.create = async (req, res) => {
  const documentosInsertados = [];
  try {
    const documentos = req.body;
    for (let documento of documentos) {
      try {
        const documentosMismoIdentificador = await Documentos.find({
          $and: [
            { correlativo: documento.correlativo },
            { codigoEstablecimiento: documento.codigoEstablecimiento },
          ],
        }).exec();
        // si existen multiples documentos con el mismo identificador, indicar el error
        if (documentosMismoIdentificador.length > 1) {
          documentosInsertados.push({
            afectado: documento.correlativo,
            realizado: false,
            error: `Existen ${documentosMismoIdentificador.length} documentos con el correlativo ${documento.correlativo} para el establecimiento ${documento.codigoEstablecimiento}.`,
          });
          continue;
        }
        // si ya existe el documento, indicar el error y decir que se inserto
        if (documentosMismoIdentificador.length === 1) {
          documentosInsertados.push({
            afectado: documento.correlativo,
            realizado: true,
            error: "El documento ya existe.",
          });
          continue;
        }
        // si el documento no existe, se inserta
        await Documentos.create(documento);
        documentosInsertados.push({
          afectado: documento.correlativo,
          realizado: true,
          error: "",
        });
      } catch (error) {
        documentosInsertados.push({
          afectado: documento.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(201).send({
      respuesta: documentosInsertados,
    });
  } catch (error) {
    res.status(500).send({
      error: `Documentos create: ${error.name} - ${error.message}`,
      respuesta: documentosInsertados,
    });
  }
};

exports.updateMany = async (req, res) => {
  const documentosActualizados = [];
  try {
    const documentos = req.body;
    for (let documento of documentos) {
      try {
        const documentosMismoIdentificador = await Documentos.find({
          $and: [
            { correlativo: documento.correlativo },
            { codigoEstablecimiento: documento.codigoEstablecimiento },
          ],
        }).exec();
        // si el documento no existe, reportar el error
        if (documentosMismoIdentificador.length === 0) {
          documentosActualizados.push({
            afectado: documento.correlativo,
            realizado: false,
            error: "El documento no existe.",
          });
          continue;
        }
        // si existen multiples documentos con el mismo identificador, indicar el error
        if (documentosMismoIdentificador.length > 1) {
          documentosActualizados.push({
            afectado: documento.correlativo,
            realizado: false,
            error: `Existen ${documentosMismoIdentificador.length} documentos con el correlativo ${documento.correlativo} para el establecimiento ${documento.codigoEstablecimiento}.`,
          });
          continue;
        }
        // si solo encontro uno para actualizar, lo actualiza
        const response = await Documentos.updateOne(
          {
            correlativo: documento.correlativo,
            codigoEstablecimiento: documento.codigoEstablecimiento,
          },
          documento
        ).exec();
        documentosActualizados.push({
          afectado: documento.correlativo,
          realizado: response.modifiedCount ? true : false,
          error: response.modifiedCount
            ? ""
            : "El documento no fue actualizado.",
        });
      } catch (error) {
        documentosActualizados.push({
          afectado: documento.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: documentosActualizados,
    });
  } catch (error) {
    res.status(500).send({
      error: `Documentos delete: ${error.name} - ${error.message}`,
      respuesta: documentosActualizados,
    });
  }
};

exports.deleteMany = async (req, res) => {
  const documentosEliminados = [];
  try {
    const identificadoresDocumentos = req.body;
    for (let identificadorDocumento of identificadoresDocumentos) {
      try {
        const documentosMismoIdentificador = await Documentos.find(
          identificadorDocumento
        ).exec();
        // si el documento no existe, reportar el error e indicar que se elimino
        if (documentosMismoIdentificador.length === 0) {
          documentosEliminados.push({
            afectado: identificadorDocumento.correlativo,
            realizado: true,
            error: "El documento no existe.",
          });
          continue;
        }
        // si existen multiples documentos con el mismo identificador, indicar el error
        if (documentosMismoIdentificador.length > 1) {
          documentosEliminados.push({
            afectado: identificadorDocumento.correlativo,
            realizado: false,
            error: `Existen ${documentosMismoIdentificador.length} documentos con el correlativo ${documento.correlativo} para el establecimiento ${documento.codigoEstablecimiento}.`,
          });
          continue;
        }
        // si solo encontro un documento para eliminar, lo elimina
        const response = await Documentos.deleteOne(
          identificadorDocumento
        ).exec();
        documentosEliminados.push({
          afectado: identificadorDocumento.correlativo,
          realizado: response.deletedCount ? true : false,
          error: response.deletedCount ? "" : "El documento no fue eliminado.",
        });
      } catch (error) {
        documentosEliminados.push({
          afectado: identificadorDocumento.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: documentosEliminados,
    });
  } catch (error) {
    res.status(500).send({
      error: `Documentos delete: ${error.name} - ${error.message}`,
      respuesta: documentosEliminados,
    });
  }
};
