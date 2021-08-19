const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Documentos = require("../models/Documentos");
const documentosSeed = require("../testSeeds/documentosSeed.json");
const { deleteOne } = require("../models/Documentos");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}documentos_test`, {
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
  numeroPaciente: {
    numero: 1,
    codigoEstablecimiento: "E01",
    hospital: {
      E01: 1,
    },
    nombreEstablecimiento: "Hospital Regional de Antofagasta",
  },
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
      delete documentoGuardar.numeroPaciente.hospital;
      const response = await request
        .post("/hradb-a-mongodb/documentos-pacientes")
        .set("Authorization", token)
        .send(documentoGuardar);

      const documentoObtenido = await Documentos.findOne({
        correlativo: documentoGuardar.correlativo,
        "numeroPaciente.hospital": {
          E01: 1,
        },
      });

      expect(response.status).toBe(201);

      expect(documentoObtenido.numeroPaciente.numero).toBe(
        documentoGuardar.numeroPaciente.numero
      );
      expect(documentoObtenido.numeroPaciente.codigoEstablecimiento).toBe(
        documentoGuardar.numeroPaciente.codigoEstablecimiento
      );
      expect(documentoObtenido.numeroPaciente.nombreEstablecimiento).toBe(
        documentoGuardar.numeroPaciente.nombreEstablecimiento
      );
      expect(Date.parse(documentoObtenido.fecha)).toBe(
        Date.parse(documentoGuardar.fecha)
      );
      expect(documentoObtenido.correlativo).toBe(documentoGuardar.correlativo);
      expect(documentoObtenido.tipo).toBe(documentoGuardar.tipo);
      documentoGuardar.numeroPaciente.hospital = {
        E01: 1,
      };
    });
  });
});
