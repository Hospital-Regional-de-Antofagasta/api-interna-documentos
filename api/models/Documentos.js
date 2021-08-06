const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Documentos = mongoose.model(
  "documento",
  new Schema({
    numeroPaciente: {
      numero: {type: Number, require: true, unique: true},
      codigoEstablecimiento: {type: String, require: true, unique: true},
      nombreEstablecimiento: String,
    },
    fecha: Date,
    correlativo: String,
    tipo: String,
  }),
  "documentos"
);

module.exports = Documentos;
