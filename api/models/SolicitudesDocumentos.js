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
        idNumero: String,
        numero: {type: Number, require: true},
        codigoEstablecimiento: {type: String, require: true},
        hospital: {},
        nombreEstablecimiento: String,
      },
      correlativoDocumento: String,
      tipoDocumento: String,
      estado: {
        // Posibles estados: PENDIENTE, EN_PROCESO
        type: String,
        default: "PENDIENTE",
      },
    },
    { timestamps: true }
  ),
  "solicitudes_documentos"
);

module.exports = SolicitudesDocumentos;
