const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp_documentos"

if(env==="test") db = `${db}_test`

const conection = mongoose.connection.useDb(db);

const Documentos = conection.model(
  "documento",
  new Schema(
    {
      correlativo: { type: Number, require: true },
      identificadorDocumento: { type: String, require: true },
      rutPaciente: { type: String, require: true },
      tipo: { type: String, require: true },
      fecha: { type: Date, require: true },
      codigoEstablecimiento: { type: String, require: true },
      nombreEstablecimiento: { type: String, require: true },
    },
    { timestamps: true }
  ),
  "documentos"
);

module.exports = Documentos;
