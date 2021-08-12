const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Documentos = mongoose.model(
  "documento",
  new Schema({
    numeroPaciente: {
      numero: {type: Number, require: true},
      codigoEstablecimiento: {type: String, require: true},
      nombreEstablecimiento: String,
    },
    fecha: Date,
    correlativo: String,
    tipo: String,
  }),//.index({'numeroPaciente.numero':1,'numeroPaciente.codigoEstablecimiento':1},{unique: true}),
  "documentos"
);

module.exports = Documentos;
