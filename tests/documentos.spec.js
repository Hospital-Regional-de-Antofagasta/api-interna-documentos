const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const Documentos = require("../api/models/Documentos");
const documentosSeed = require("./testSeeds/documentosSeed.json");
const { deleteOne } = require("../api/models/Documentos");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/documentos_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Documentos.create(documentosSeed);
});

afterEach(async () => {
  await Documentos.deleteMany();
  await mongoose.disconnect();
});

const documentoGuardar = {
  numeroPaciente: 1,
  fecha: "2021-07-15",
  correlativo: "11",
  tipo: "DAU",
};

describe("Endpoints documentos", () => {
  describe("POST /hradb-a-mongodb/documentos-pacientes/", () => {
    it("Should not create documento without token", async () => {
      const response = await request
        .post("/hradb-a-mongodb/documentos-pacientes")
        .set("Authorization", "no-token")
        .send(documentoGuardar);

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    it("Should create documento", async () => {
      const response = await request
        .post("/hradb-a-mongodb/documentos-pacientes")
        .set("Authorization", token)
        .send(documentoGuardar);

      const documentoObtenido = await Documentos.findOne({
        correlativo: documentoGuardar.correlativo,
      });

      expect(response.status).toBe(201);

      expect(documentoObtenido.numeroPaciente).toBe(
        documentoGuardar.numeroPaciente
      );
      expect(Date.parse(documentoObtenido.fecha)).toBe(
        Date.parse(documentoGuardar.fecha)
      );
      expect(documentoObtenido.correlativo).toBe(documentoGuardar.correlativo);
      expect(documentoObtenido.tipo).toBe(documentoGuardar.tipo);
    });
  });
});
