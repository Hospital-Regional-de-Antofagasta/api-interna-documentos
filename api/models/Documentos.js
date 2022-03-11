const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp_documentos";

if (env === "test") db = `${db}_test`;

const conection = mongoose.connection.useDb(db);

const Documentos = conection.model(
  "documento",
  new Schema(
    {
      correlativo: { type: Number, required: true },
      identificadorDocumento: { type: String, required: true },
      rutPaciente: { type: String, required: true },
      tipo: { type: String, required: true },
      fecha: { type: Date, required: true },
      codigoEstablecimiento: { type: String, required: true },
      nombreEstablecimiento: { type: String, required: true },
    },
    { timestamps: true }
  ),
  "documentos"
);

module.exports = Documentos;
