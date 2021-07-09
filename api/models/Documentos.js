const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Documentos = mongoose.model(
  "documento",
  new Schema({
    numeroPaciente: Number,
    fecha: Date,
    correlativo: String,
    tipo: String,
  }),
  "documentos"
);

module.exports = Documentos;
