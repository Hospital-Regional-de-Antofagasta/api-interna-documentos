const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const Documentos = require("../api/models/Documentos");
const documentosSeed = require("../tests/testSeeds/documentosSeed.json");
const documentosAInsertarSeed = require("../tests/testSeeds/documentosAInsertarSeed.json");
const documentosAActualizarSeed = require("../tests/testSeeds/documentosAActualizarSeed.json");
const documentosAEliminarSeed = require("../tests/testSeeds/documentosAEliminarSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

const documentoGuardar = {
  correlativo: 9,
  identificadorDocumento: "1511290090",
  rutPaciente: "15501629-9",
  tipo: "DAU",
  fecha: "2015-11-29",
  codigoEstablecimiento: "HRA",
  nombreEstablecimiento: "Hospital Regional Antofagasta Dr. Leonardo Guzmán",
};

const documentoActualizar = {
  correlativo: 2,
  identificadorDocumento: "0000000002",
  rutPaciente: "11111111-1",
  tipo: "DAU",
  fecha: "2021-01-02",
  codigoEstablecimiento: "HRA",
  nombreEstablecimiento: "Hospital Regional Antofagasta Dr. Leonardo Guzmán",
};

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/documentos_salida_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Documentos.create(documentosSeed);
});

afterEach(async () => {
  await Documentos.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints documentos salida", () => {
  describe("POST /inter-mongo-documentos/salida", () => {
    it("Should not save documento without token", async () => {
      const response = await request
        .post("/inter-mongo-documentos/salida")
        .send(documentoGuardar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const documentoDespues = await Documentos.findOne({
          $and: [
            { correlativo: documentoGuardar.correlativo },
            { codigoEstablecimiento: documentoGuardar.codigoEstablecimiento },
          ],
      });

      expect(documentoDespues).toBeFalsy();
    });
    it("Should not save documento with invalid token", async () => {
      const response = await request
        .post("/inter-mongo-documentos/salida")
        .set("Authorization", "no-token")
        .send(documentoGuardar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const documentoDespues = await Documentos.findOne({
          $and: [
            { correlativo: documentoGuardar.correlativo },
            { codigoEstablecimiento: documentoGuardar.codigoEstablecimiento },
          ],
      });

      expect(documentoDespues).toBeFalsy();
    });
    it("Should save documento", async () => {
      const response = await request
        .post("/inter-mongo-documentos/salida")
        .set("Authorization", token)
        .send([documentoGuardar]);

      expect(response.status).toBe(201);

      const documentoDespues = await Documentos.findOne({
          $and: [
            { correlativo: documentoGuardar.correlativo },
            { codigoEstablecimiento: documentoGuardar.codigoEstablecimiento },
          ],
      }).exec();

      expect(documentoDespues).toBeTruthy();
      expect(documentoDespues.correlativo).toBe(documentoGuardar.correlativo);
      expect(documentoDespues.identificadorDocumento).toBe(
        documentoGuardar.identificadorDocumento
      );
      expect(documentoDespues.rutPaciente).toBe(documentoGuardar.rutPaciente);
      expect(documentoDespues.tipo).toBe(documentoGuardar.tipo);
      expect(Date.parse(documentoDespues.fecha)).toBe(
        Date.parse(documentoGuardar.fecha)
      );
      expect(documentoDespues.codigoEstablecimiento).toBe(
        documentoGuardar.codigoEstablecimiento
      );
      expect(documentoDespues.nombreEstablecimiento).toBe(
        documentoGuardar.nombreEstablecimiento
      );
    });
    it("Should save multiple documentos and return errors", async () => {
      const response = await request
        .post("/inter-mongo-documentos/salida")
        .set("Authorization", token)
        .send(documentosAInsertarSeed);

      expect(response.status).toBe(201);

      const documentosBD = await Documentos.find().exec();

      expect(documentosBD.length).toBe(11);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(7);
      expect(respuesta).toEqual([
        {
          afectado: 1,
          realizado: true,
          error: "El documento ya existe.",
        },
        {
          afectado: 13,
          realizado: true,
          error: "",
        },
        {
          afectado: 2,
          realizado: true,
          error: "El documento ya existe.",
        },
        {
          afectado: 14,
          realizado: true,
          error: "",
        },
        {
          afectado: 16,
          realizado: false,
          error:
            "MongoServerError - E11000 duplicate key error collection: documentos_salida_test.documentos index: _id_ dup key: { _id: ObjectId('303030303030303030303032') }",
        },
        {
          afectado: 15,
          realizado: true,
          error: "",
        },
        {
          afectado: 4,
          realizado: true,
          error: "El documento ya existe.",
        },
      ]);
    });
  });
  describe("PUT /inter-mongo-documentos/salida", () => {
    it("Should not update documento without token", async () => {
      const documentoAntes = await Documentos.findOne({
          $and: [
            { correlativo: documentoActualizar.correlativo },
            { codigoEstablecimiento: documentoActualizar.codigoEstablecimiento },
          ],
      }).exec();

      const response = await request
        .put("/inter-mongo-documentos/salida")
        .send(documentoActualizar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const documentoDespues = await Documentos.findOne({
          $and: [
            { correlativo: documentoActualizar.correlativo },
            { codigoEstablecimiento: documentoActualizar.codigoEstablecimiento },
          ],
      }).exec();

      expect(documentoAntes).toEqual(documentoDespues);
    });
    it("Should not update documento with invalid token", async () => {
      const documentoAntes = await Documentos.findOne({
          $and: [
            { correlativo: documentoActualizar.correlativo },
            { codigoEstablecimiento: documentoActualizar.codigoEstablecimiento },
          ],
      }).exec();

      const response = await request
        .put("/inter-mongo-documentos/salida")
        .set("Authorization", "no-token")
        .send(documentoActualizar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const documentoDespues = await Documentos.findOne({
          $and: [
            { correlativo: documentoActualizar.correlativo },
            { codigoEstablecimiento: documentoActualizar.codigoEstablecimiento },
          ],
      }).exec();

      expect(documentoAntes).toEqual(documentoDespues);
    });
    it("Should update documento", async () => {
      const response = await request
        .put("/inter-mongo-documentos/salida")
        .set("Authorization", token)
        .send([documentoActualizar]);

      expect(response.status).toBe(200);

      const documentoDespues = await Documentos.findOne({
          $and: [
            { correlativo: documentoActualizar.correlativo },
            { codigoEstablecimiento: documentoActualizar.codigoEstablecimiento },
          ],
      }).exec();

      expect(documentoDespues.correlativo).toBe(
        documentoActualizar.correlativo
      );
      expect(documentoDespues.identificadorDocumento).toBe(
        documentoActualizar.identificadorDocumento
      );
      expect(documentoDespues.rutPaciente).toBe(
        documentoActualizar.rutPaciente
      );
      expect(documentoDespues.tipo).toBe(documentoActualizar.tipo);
      expect(Date.parse(documentoDespues.fecha)).toBe(
        Date.parse(documentoActualizar.fecha)
      );
      expect(documentoDespues.codigoEstablecimiento).toBe(
        documentoActualizar.codigoEstablecimiento
      );
      expect(documentoDespues.nombreEstablecimiento).toBe(
        documentoActualizar.nombreEstablecimiento
      );
    });
    it("Should update multiple documentos and return errors", async () => {
      const response = await request
        .put("/inter-mongo-documentos/salida")
        .set("Authorization", token)
        .send(documentosAActualizarSeed);

      expect(response.status).toBe(200);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);

      expect(respuesta).toEqual([
        {
          afectado: 10,
          realizado: false,
          error: "El documento no existe.",
        },
        {
          afectado: 2,
          realizado: true,
          error: "",
        },
        {
          afectado: 3,
          realizado: false,
          error:
            "MongoServerError - Performing an update on the path '_id' would modify the immutable field '_id'",
        },
        {
          afectado: 3,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
  describe("DELETE /inter-mongo-documentos/salida", () => {
    it("Should not delete documento without token", async () => {
      const documentoAntes = await Documentos.findOne({
        correlativo: 1,
        codigoEstablecimiento: "HRA",
      }).exec();

      const response = await request
        .delete("/inter-mongo-documentos/salida")
        .send([{ correlativo: 1, codigoEstablecimiento: "HRA" }]);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const documentoDespues = await Documentos.findOne({
        correlativo: 1,
        codigoEstablecimiento: "HRA",
      }).exec();

      expect(documentoAntes).toEqual(documentoDespues);
    });
    it("Should not delete documento with invalid token", async () => {
      const documentoAntes = await Documentos.findOne({
        correlativo: 1,
        codigoEstablecimiento: "HRA",
      }).exec();

      const response = await request
        .delete("/inter-mongo-documentos/salida")
        .set("Authorization", "no-token")
        .send([{ correlativo: 1, codigoEstablecimiento: "HRA" }]);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const documentoDespues = await Documentos.findOne({
        correlativo: 1,
        codigoEstablecimiento: "HRA",
      }).exec();

      expect(documentoAntes).toEqual(documentoDespues);
    });
    it("Should delete documento", async () => {
      const response = await request
        .delete("/inter-mongo-documentos/salida")
        .set("Authorization", token)
        .send([{ correlativo: 1, codigoEstablecimiento: "HRA" }]);

      const documentoDespues = await Documentos.findOne({
        correlativo: 1,
        codigoEstablecimiento: "HRA",
      }).exec();

      expect(response.status).toBe(200);
      expect(documentoDespues).toBeFalsy();
    });
    it("Should delete multiple documentos and return errors", async () => {
      const response = await request
        .delete("/inter-mongo-documentos/salida")
        .set("Authorization", token)
        .send(documentosAEliminarSeed);

      expect(response.status).toBe(200);

      const documentosBD = await Documentos.find().exec();

      expect(documentosBD.length).toBe(6);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      expect(respuesta).toEqual([
        {
          afectado: 14,
          realizado: true,
          error: "El documento no existe.",
        },
        {
          afectado: 1,
          realizado: true,
          error: "",
        },
        {
          afectado: 15,
          realizado: true,
          error: "El documento no existe.",
        },
        {
          afectado: 3,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
});
