const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const documentos = require("./routes/documentos");
const solicitudesDocumentos = require("./routes/solicitudesDocumentos");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/hradb-a-mongodb/documentos-pacientes", documentos);

app.use(
  "/hradb-a-mongodb/documentos-pacientes/solicitudes",
  solicitudesDocumentos
);

app.use("/v1/hola", (req, res) => {
  res.status(200).send({ hola: "hola"})
});

module.exports = app;
