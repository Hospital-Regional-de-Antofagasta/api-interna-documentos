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
        numero: {type: Number, require: true},
        codigoEstablecimiento: {type: String, require: true},
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
  ),//.index({'numeroPaciente.numero':1,'numeroPaciente.codigoEstablecimiento':1},{unique: true}),
  "solicitudes_documentos"
);

module.exports = SolicitudesDocumentos;
