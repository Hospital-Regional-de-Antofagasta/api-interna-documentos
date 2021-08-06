const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SolicitudesDocumentos = mongoose.model(
  "solicitudes_documentos",
  new Schema(
    {
      correlativoSolicitud: {
        type: Number,
        default: 0,
      },
      anio: {
        type: Number,
        default: 0,
      },
      numeroPaciente: {
        numero: {type: Number, require: true, unique: true},
        codigoEstablecimiento: {type: String, require: true, unique: true},
        nombreEstablecimiento: String,
      },
      correlativoDocumento: String,
      tipoDocumento: String,
      estado: {
        // posibles estados: PENDIENTE, EN_PROCESO
        type: String,
        default: "PENDIENTE",
      },
    },
    { timestamps: true }
  ),
  "solicitudes_documentos"
);

module.exports = SolicitudesDocumentos;
