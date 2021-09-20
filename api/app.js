require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const documentos = require("./routes/documentos");
const solicitudesDocumentos = require("./routes/solicitudesDocumentos");

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

app.use("/hradb-a-mongodb/documentos-pacientes", documentos);

app.use(
  "/hradb-a-mongodb/documentos-pacientes/solicitudes",
  solicitudesDocumentos
);

app.get("/hradb-a-mongodb/documentos-pacientes/health", (req, res) => {
  res.status(200).send("ready");
});

if (require.main === module) { // true if file is executed
  process.on("SIGINT",function (){
    process.exit();
  });
  app.listen(port, () => {
    console.log(`App listening at http://${localhost}:${port}`)
  })
}

module.exports = app;
