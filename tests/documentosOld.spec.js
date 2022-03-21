const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const Documentos = require("../api/models/DocumentosOld");
const documentosSeed = require("./testSeeds/documentosOldSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  // await mongoose.disconnect();
  // await mongoose.connect(`${process.env.MONGO_URI}/documentos_test`, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  await Documentos.create(documentosSeed);
});

afterEach(async () => {
  await Documentos.deleteMany();
  // await mongoose.disconnect();
});

afterAll(async () => {
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
    // it("Should create documento", async () => {
    //   const response = await request
    //     .post("/hradb-a-mongodb/documentos-pacientes")
    //     .set("Authorization", token)
    //     .send(documentoGuardar);

    //   const documentoObtenido = await Documentos.findOne({
    //     correlativo: documentoGuardar.correlativo,
    //   });

    //   expect(response.status).toBe(201);

    //   expect(documentoObtenido.numeroPaciente).toBe(
    //     documentoGuardar.numeroPaciente
    //   );
    //   expect(Date.parse(documentoObtenido.fecha)).toBe(
    //     Date.parse(documentoGuardar.fecha)
    //   );
    //   expect(documentoObtenido.correlativo).toBe(documentoGuardar.correlativo);
    //   expect(documentoObtenido.tipo).toBe(documentoGuardar.tipo);
    // });
    it("Should create documentos", async () => {
      const response = await request
        .post("/hradb-a-mongodb/documentos-pacientes")
        .set("Authorization", token)
        .send([documentoGuardar]);

      const documentoObtenido = await Documentos.findOne({
        correlativo: documentoGuardar.correlativo
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
    it("Should not create documento existente", async () => {
      const documentosAntes = await Documentos.find().exec();

      const response = await request
        .post("/hradb-a-mongodb/documentos-pacientes")
        .set("Authorization", token)
        .send([{
          numeroPaciente: 1,
          fecha: "2021-06-07",
          correlativo: "1",
          tipo: "DAU",
        }]);

      expect(response.status).toBe(201);

      const documentosDespues = await Documentos.find().exec();

      expect(documentosAntes.length).toBe(documentosDespues.length);

      const documentoObtenido = await Documentos.findOne({
        correlativo: "1",
      });

      expect(documentoObtenido.numeroPaciente).toBe(1);
      expect(Date.parse(documentoObtenido.fecha)).toBe(
        Date.parse("2021-06-01")
      );
      expect(documentoObtenido.correlativo).toBe("1");
      expect(documentoObtenido.tipo).toBe("DAU");
    });
  });
});
