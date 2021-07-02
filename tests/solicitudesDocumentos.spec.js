const supertest = require("supertest");
const app = require("../api/index");
const mongoose = require("mongoose");
const SolicitudesDocumentos = require("../api/models/SolicitudesDocumentos");
const solicitudesDocumentosSeed = require("../api/testSeeds/solicitudesDocumentosSeed.json");
const muchasSolicitudesDocumentosSeed = require("../api/testSeeds/muchasSolicitudesDocumentosSeed.json");
const muchasSolicitudesDocumentosNoRespondidasSeed = require("../api/testSeeds/muchasSolicitudesDocumentosNoRespondidasSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}documentos_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await SolicitudesDocumentos.create(solicitudesDocumentosSeed);
});

afterEach(async () => {
  await SolicitudesDocumentos.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints solicitudes documentos", () => {
  describe("Get pending solicitudes documentos", () => {
    it("Should not get solicitudes documentos without token", async () => {
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/no-enviadas")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });

    it("Should get no solicitudes documentos from empty database", async () => {
      await SolicitudesDocumentos.deleteMany();
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/no-enviadas")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("Should get pending solicitudes documentos", async () => {
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/no-enviadas")
        .set("Authorization", token);

      const solicitudesActualizadas = await SolicitudesDocumentos.find({
        enviadaHospital: true,
      });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
      expect(
        response.body.filter((solicitud) => solicitud.enviadaHospital).length
      ).toBe(0);
      expect(solicitudesActualizadas.length).toBe(5);
    });

    it("Should get at most 100 solicitudes documentos", async () => {
      await SolicitudesDocumentos.deleteMany();
      await SolicitudesDocumentos.create(muchasSolicitudesDocumentosSeed);
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/no-enviadas")
        .set("Authorization", token);

      const solicitudesActualizadas = await SolicitudesDocumentos.find({
        enviadaHospital: true,
      });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(100);
      expect(
        response.body.filter((solicitud) => solicitud.enviadaHospital).length
      ).toBe(0);
      expect(solicitudesActualizadas.length).toBe(128);
    });
  });

  describe("Update solicitud documento status and add correlativoCita", () => {
    it("Should not update solicitud documento without token", async () => {
      const newSolicitudDocumento = await SolicitudesDocumentos.create({
        correlativoSolicitud: null,
        numeroPaciente: 123,
        correlativoDocumento: 456,
        tipoDocumento: "DAU",
        respondida: false,
        enviadaHospital: false,
      });
      const response = await request
        .put(
          `/hradb-a-mongodb/documentos-pacientes/solicitudes/${newSolicitudDocumento._id}`
        )
        .set("Authorization", "no-token")
        .send({
          correlativoSolicitud: 789,
          respondida: true,
        });

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });

    it("Should not update solicitud documento if it does not exists", async () => {
      const response = await request
        .put(
          `/hradb-a-mongodb/documentos-pacientes/solicitudes/60a26ce906ec5a89b4fd6240`
        )
        .set("Authorization", token)
        .send({
          correlativoSolicitud: 789,
          respondida: true,
        });

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it("Should update state of solicitud documento", async () => {
      const newSolicitudDocumento = await SolicitudesDocumentos.create({
        correlativoSolicitud: null,
        numeroPaciente: 123,
        correlativoDocumento: 456,
        tipoDocumento: "DAU",
        respondida: false,
        enviadaHospital: false,
      });
      const response = await request
        .put(
          `/hradb-a-mongodb/documentos-pacientes/solicitudes/${newSolicitudDocumento._id}`
        )
        .set("Authorization", token)
        .send({
          correlativoSolicitud: 789,
          respondida: true,
        });

      const solicitudDocumentoActualizada =
        await SolicitudesDocumentos.findById(newSolicitudDocumento._id);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      expect(solicitudDocumentoActualizada.correlativoSolicitud).toBe(789);
      expect(solicitudDocumentoActualizada.respondida).toBeTruthy();
    });
  });

  describe("Get solicitudes documentos enviadas y no respondidas", () => {
    it("Should not get solicitudes documentos without token", async () => {
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/no-respondidas")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });

    it("Should get no solicitudes documentos from empty database", async () => {
      await SolicitudesDocumentos.deleteMany();
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/no-respondidas")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("Should get solicitudes documentos enviadas y no respondidas", async () => {
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/no-respondidas")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    it("Should get at most 100 solicitudes documentos enviadas y no respondidas", async () => {
      await SolicitudesDocumentos.deleteMany();
      await SolicitudesDocumentos.create(
        muchasSolicitudesDocumentosNoRespondidasSeed
      );
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/no-respondidas")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(100);
    });
  });
});
