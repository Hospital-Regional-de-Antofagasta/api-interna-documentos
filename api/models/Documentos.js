const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Documentos = mongoose.model(
  "documento",
  new Schema({
    numeroPaciente: {
      idNumero: String,
      numero: {type: Number, require: true},
      codigoEstablecimiento: {type: String, require: true},
      hospital: {},
      nombreEstablecimiento: String,
    },
    fecha: Date,
    correlativo: String,
    tipo: String,
  }),
  "documentos"
);

module.exports = Documentos;
