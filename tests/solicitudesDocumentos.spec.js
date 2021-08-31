const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const SolicitudesDocumentos = require("../api/models/SolicitudesDocumentos");
const solicitudesDocumentosSeed = require("./testSeeds/solicitudesDocumentosSeed.json");
const muchasSolicitudesDocumentosSeed = require("./testSeeds/muchasSolicitudesDocumentosSeed.json");
const muchasSolicitudesDocumentosNoRespondidasSeed = require("./testSeeds/muchasSolicitudesDocumentosNoRespondidasSeed.json");

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
  describe("GET /hradb-a-mongodb/documentos-pacientes/solicitudes/?estado", () => {
    it("Should not get solicitudes documentos without token", async () => {
      const response = await request
        .get(
          "/hradb-a-mongodb/documentos-pacientes/solicitudes/?estado=PENDIENTE"
        )
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    it("Should get no solicitudes documentos from empty database", async () => {
      await SolicitudesDocumentos.deleteMany();
      const response = await request
        .get(
          "/hradb-a-mongodb/documentos-pacientes/solicitudes/?estado=PENDIENTE"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    it("Should get all solicitudes documentos", async () => {
      const response = await request
        .get(
          "/hradb-a-mongodb/documentos-pacientes/solicitudes/"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(5);
    });
    it("Should get pending solicitudes documentos", async () => {
      const response = await request
        .get(
          "/hradb-a-mongodb/documentos-pacientes/solicitudes/?estado=PENDIENTE"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
    });
    it("Should get solicitudes documentos in progress", async () => {
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/?estado=EN_PROCESO")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
    it("Should get at most 100 solicitudes documentos in progress", async () => {
      await SolicitudesDocumentos.deleteMany();
      await SolicitudesDocumentos.create(muchasSolicitudesDocumentosSeed);
      const response = await request
        .get(
          "/hradb-a-mongodb/documentos-pacientes/solicitudes/?estado=PENDIENTE"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(100);
    });
    it("Should get at most 100 solicitudes documentos en proceso", async () => {
      await SolicitudesDocumentos.deleteMany();
      await SolicitudesDocumentos.create(
        muchasSolicitudesDocumentosNoRespondidasSeed
      );
      const response = await request
        .get("/hradb-a-mongodb/documentos-pacientes/solicitudes/?estado=EN_PROCESO")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(100);
    });
  });
  describe("PUT /hradb-a-mongodb/documentos-pacientes/solicitudes/:idSolicitud", () => {
    it("Should not update solicitud documento without token", async () => {
      const newSolicitudDocumento = await SolicitudesDocumentos.create({
        correlativoSolicitud: 0,
        anio: 0,
        numeroPaciente: 123,
        correlativoDocumento: "456",
        tipoDocumento: "DAU",
        estado: "EN_PROCESO",
      });
      const response = await request
        .put(
          `/hradb-a-mongodb/documentos-pacientes/solicitudes/${newSolicitudDocumento._id}`
        )
        .set("Authorization", "no-token")
        .send({
          correlativoSolicitud: 789,
          anio: 2021,
          numeroPaciente: 123,
          correlativoDocumento: "456",
          tipoDocumento: "DAU",
          estado: "REALIZADO",
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
          anio: 2021,
          numeroPaciente: 123,
          correlativoDocumento: "456",
          tipoDocumento: "DAU",
          estado: "REALIZADO",
        });

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
    it("Should update state of solicitud documento pendiente", async () => {
      const newContenidoSolicitud = {
        correlativoSolicitud: 0,
        anio: 0,
        numeroPaciente: 123,
        correlativoDocumento: "456",
        tipoDocumento: "DAU",
        estado: "PENDIENTE",
      };
      const newSolicitudDocumento = await SolicitudesDocumentos.create(
        newContenidoSolicitud
      );

      const datosSolicitudActualizar = {
        correlativoSolicitud: 789,
        anio: 2021,
        numeroPaciente: 123,
        correlativoDocumento: "456",
        tipoDocumento: "DAU",
        estado: "EN_PROCESO",
      };
      const response = await request
        .put(
          `/hradb-a-mongodb/documentos-pacientes/solicitudes/${newSolicitudDocumento._id}`
        )
        .set("Authorization", token)
        .send(datosSolicitudActualizar);

      const solicitudDocumentoActualizada =
        await SolicitudesDocumentos.findById(newSolicitudDocumento._id);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      expect(solicitudDocumentoActualizada.correlativoSolicitud).toBe(
        datosSolicitudActualizar.correlativoSolicitud
      );
      expect(solicitudDocumentoActualizada.anio).toBe(
        datosSolicitudActualizar.anio
      );
      expect(solicitudDocumentoActualizada.numeroPaciente).toBe(
        datosSolicitudActualizar.numeroPaciente
      );
      expect(solicitudDocumentoActualizada.correlativoDocumento).toBe(
        datosSolicitudActualizar.correlativoDocumento
      );
      expect(solicitudDocumentoActualizada.tipoDocumento).toBe(
        datosSolicitudActualizar.tipoDocumento
      );
      expect(solicitudDocumentoActualizada.estado).toBe(
        datosSolicitudActualizar.estado
      );
    });
  });
  describe("DELETE /hradb-a-mongodb/documentos-pacientes/solicitudes/:idSolicitud", () => {
    it("Should not delete solicitud documento without token", async () => {
      const newSolicitudDocumento = await SolicitudesDocumentos.create({
        correlativoSolicitud: 789,
        anio: 2021,
        numeroPaciente: 123,
        correlativoDocumento: "456",
        tipoDocumento: "DAU",
        estado: "EN_PROCESO",
      });
      const response = await request
        .delete(
          `/hradb-a-mongodb/documentos-pacientes/solicitudes/${newSolicitudDocumento._id}`
        )
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    it("Should not delete solicitud documento if it does not exists", async () => {
      const response = await request
        .delete(
          `/hradb-a-mongodb/documentos-pacientes/solicitudes/60a26ce906ec5a89b4fd6240`
        )
        .set("Authorization", token);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
    it("Should delete solicitud documento en proceso", async () => {
      const newContenidoSolicitud = {
        correlativoSolicitud: 789,
        anio: 2021,
        numeroPaciente: 123,
        correlativoDocumento: "456",
        tipoDocumento: "DAU",
        estado: "EN_PROCESO",
      };
      const newSolicitudDocumento = await SolicitudesDocumentos.create(
        newContenidoSolicitud
      );

      const response = await request
        .delete(
          `/hradb-a-mongodb/documentos-pacientes/solicitudes/${newSolicitudDocumento._id}`
        )
        .set("Authorization", token);

      const solicitudDocumentoEliminada =
        await SolicitudesDocumentos.findById(newSolicitudDocumento._id);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(solicitudDocumentoEliminada).toBeFalsy();
    });
  });
});
