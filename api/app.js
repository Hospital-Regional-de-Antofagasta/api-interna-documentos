require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const documentosSalida = require("./routes/documentosSalida");
const documentosEntrada = require("./routes/documentosEntrada");
const documentos = require("./routes/documentosOld");
const solicitudesDocumentos = require("./routes/solicitudesDocumentosOld");

const app = express();
app.use(express.json());
app.use(cors());

const connection = process.env.MONGO_URI
const port = process.env.PORT
const localhost = process.env.HOSTNAME

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/inter-mongo-documentos/health", (req, res) => {
  res.status(200).send("ready");
});

// Desde el hospital a la nube
app.use("/inter-mongo-documentos/salida", documentosSalida);

// Desde la nube al hospital
app.use("/inter-mongo-documentos/entrada", documentosEntrada);

app.use("/hradb-a-mongodb/documentos-pacientes", documentos);

app.use(
  "/hradb-a-mongodb/documentos-pacientes/solicitudes",
  solicitudesDocumentos
);

if (require.main === module) { // true if file is executed
  process.on("SIGINT",function (){
    process.exit();
  });
  app.listen(port, () => {
    console.log(`App listening at http://${localhost}:${port}`)
  })
}

module.exports = app;
