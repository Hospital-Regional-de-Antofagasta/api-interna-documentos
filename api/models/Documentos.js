const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Documentos = mongoose.model(
  "documento",
  new Schema({
    numeroPaciente: {type: Number, require: true},
    fecha: Date,
    correlativo: String,
    tipo: String,
  }),
  "documentos"
);

module.exports = Documentos;
