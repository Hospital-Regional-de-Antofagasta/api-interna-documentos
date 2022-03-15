const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp"

if(env==="test") db = `${db}_test`

const conection = mongoose.connection.useDb(db);

const Documentos = conection.model(
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