const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const SolicitudesDocumentos = require("../api/models/SolicitudesDocumentos");
const solicitudesDocumentosSeed = require("./testSeeds/solicitudesDocumentosSeed.json");
const muchasSolicitudesDocumentosSeed = require("./testSeeds/muchasSolicitudesDocumentosSeed.json");
const solicitudesDocumentosAActualizarSeed = require("./testSeeds/solicitudesDocumentosAActualizarSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(
    `${process.env.MONGO_URI}/solicitudes_documentos_test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await SolicitudesDocumentos.create(solicitudesDocumentosSeed);
});

afterEach(async () => {
  await SolicitudesDocumentos.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints solicitudes documentos", () => {
  describe("GET /inter-mongo-documentos/entrada/solicitudes-envio", () => {
    it("Should not get solicitudes documentos without token", async () => {
      const response = await request.get(
        "/inter-mongo-documentos/entrada/solicitudes-envio?estado=PENDIENTE"
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should not get solicitudes documentos with invalid token", async () => {
      const response = await request
        .get(
          "/inter-mongo-documentos/entrada/solicitudes-envio?estado=PENDIENTE"
        )
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should not get solicitudes documentos without codigo establecimiento", async () => {
      const response = await request
        .get(
          "/inter-mongo-documentos/entrada/solicitudes-envio?estado=PENDIENTE"
        )
        .set("Authorization", token);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );
    });
    it("Should get no solicitudes documentos from empty database", async () => {
      await SolicitudesDocumentos.deleteMany();
      const response = await request
        .get(
          "/inter-mongo-documentos/entrada/solicitudes-envio?estado=PENDIENTE&codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    it("Should get solicitudes documentos from all types", async () => {
      const response = await request
        .get(
          "/inter-mongo-documentos/entrada/solicitudes-envio?codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);

      expect(response.body.length).toBe(7);

      let solicitud = response.body.find(
        (element) => element._id === "303030303030303030303031"
      );

      expect(solicitud).toBeTruthy();
      expect(solicitud.codigoEstablecimiento).toBe("HRA");
      expect(solicitud.rutPaciente).toBe("11111111-1");
      expect(solicitud.identificadorDocumento).toBe("1");
      expect(solicitud.tipoDocumento).toBe("DAU");
      expect(solicitud.correlativoSolicitud).toBe(1);
      expect(solicitud.anio).toBe(2021);
      expect(solicitud.estado).toBe("REALIZADO");

      solicitud = response.body.find(
        (element) => element._id === "303030303030303030303032"
      );

      expect(solicitud).toBeTruthy();
      expect(solicitud.codigoEstablecimiento).toBe("HRA");
      expect(solicitud.rutPaciente).toBe("11111111-1");
      expect(solicitud.identificadorDocumento).toBe("2");
      expect(solicitud.tipoDocumento).toBe("DAU");
      expect(solicitud.correlativoSolicitud).toBe(0);
      expect(solicitud.anio).toBe(0);
      expect(solicitud.estado).toBe("PENDIENTE");

      solicitud = response.body.find(
        (element) => element._id === "303030303030303030303033"
      );

      expect(solicitud).toBeTruthy();
      expect(solicitud.codigoEstablecimiento).toBe("HRA");
      expect(solicitud.rutPaciente).toBe("11111111-1");
      expect(solicitud.identificadorDocumento).toBe("1");
      expect(solicitud.tipoDocumento).toBe("EPICRISIS");
      expect(solicitud.correlativoSolicitud).toBe(0);
      expect(solicitud.anio).toBe(0);
      expect(solicitud.estado).toBe("PENDIENTE");

      solicitud = response.body.find(
        (element) => element._id === "303030303030303030303034"
      );

      expect(solicitud).toBeTruthy();
      expect(solicitud.codigoEstablecimiento).toBe("HRA");
      expect(solicitud.rutPaciente).toBe("22222222-2");
      expect(solicitud.identificadorDocumento).toBe("1");
      expect(solicitud.tipoDocumento).toBe("DAU");
      expect(solicitud.correlativoSolicitud).toBe(2);
      expect(solicitud.anio).toBe(2021);
      expect(solicitud.estado).toBe("EN_PROCESO");

      solicitud = response.body.find(
        (element) => element._id === "303030303030303030303035"
      );

      expect(solicitud).toBeTruthy();
      expect(solicitud.codigoEstablecimiento).toBe("HRA");
      expect(solicitud.rutPaciente).toBe("11111111-1");
      expect(solicitud.identificadorDocumento).toBe("2");
      expect(solicitud.tipoDocumento).toBe("EPICRISIS");
      expect(solicitud.correlativoSolicitud).toBe(0);
      expect(solicitud.anio).toBe(0);
      expect(solicitud.estado).toBe("PENDIENTE");

      solicitud = response.body.find(
        (element) => element._id === "303030303030303030303036"
      );

      expect(solicitud).toBeTruthy();
      expect(solicitud.codigoEstablecimiento).toBe("HRA");
      expect(solicitud.rutPaciente).toBe("33333333-3");
      expect(solicitud.identificadorDocumento).toBe("456");
      expect(solicitud.tipoDocumento).toBe("DAU");
      expect(solicitud.correlativoSolicitud).toBe(0);
      expect(solicitud.anio).toBe(0);
      expect(solicitud.estado).toBe("PENDIENTE");

      solicitud = response.body.find(
        (element) => element._id === "303030303030303030303037"
      );

      expect(solicitud).toBeTruthy();
      expect(solicitud.codigoEstablecimiento).toBe("HRA");
      expect(solicitud.rutPaciente).toBe("33333333-3");
      expect(solicitud.identificadorDocumento).toBe("456");
      expect(solicitud.tipoDocumento).toBe("DAU");
      expect(solicitud.correlativoSolicitud).toBe(789);
      expect(solicitud.anio).toBe(2021);
      expect(solicitud.estado).toBe("EN_PROCESO");
    });
    it("Should get pending solicitudes documentos", async () => {
      const response = await request
        .get(
          "/inter-mongo-documentos/entrada/solicitudes-envio?estado=PENDIENTE&codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
    });
    it("Should get solicitudes documentos in progress", async () => {
      const response = await request
        .get(
          "/inter-mongo-documentos/entrada/solicitudes-envio?estado=EN_PROCESO&codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
    it("Should get at most 100 pending solicitudes documentos", async () => {
      await SolicitudesDocumentos.deleteMany();
      await SolicitudesDocumentos.create(muchasSolicitudesDocumentosSeed);
      const response = await request
        .get(
          "/inter-mongo-documentos/entrada/solicitudes-envio?estado=PENDIENTE&codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(100);
    });
    it("Should get at most 100 solicitudes documentos in progress", async () => {
      await SolicitudesDocumentos.deleteMany();
      await SolicitudesDocumentos.create(muchasSolicitudesDocumentosSeed);
      const response = await request
        .get(
          "/inter-mongo-documentos/entrada/solicitudes-envio?estado=EN_PROCESO&codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(100);
    });
  });
  describe("PUT /inter-mongo-documentos/entrada/solicitudes-envio", () => {
    it("Should not update solicitud documento without token", async () => {
      const solicitudesAntes = SolicitudesDocumentos.find().exec();

      const response = await request.put(
        `/inter-mongo-documentos/entrada/solicitudes-envio`
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acceso no autorizado.");

      const solicitudesDespues = SolicitudesDocumentos.find().exec();

      expect(solicitudesAntes).toEqual(solicitudesDespues);
    });
    it("Should not get solicitudes documentos with invalid token", async () => {
      const solicitudesAntes = SolicitudesDocumentos.find().exec();

      const response = await request
        .put(`/inter-mongo-documentos/entrada/solicitudes-envio`)
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acceso no autorizado.");

      const solicitudesDespues = SolicitudesDocumentos.find().exec();

      expect(solicitudesAntes).toEqual(solicitudesDespues);
    });
    it("Should not get solicitudes documentos without codigo establecimiento", async () => {
      const solicitudesAntes = SolicitudesDocumentos.find().exec();

      const response = await request
        .put(`/inter-mongo-documentos/entrada/solicitudes-envio`)
        .set("Authorization", token);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );

      const solicitudesDespues = SolicitudesDocumentos.find().exec();

      expect(solicitudesAntes).toEqual(solicitudesDespues);
    });
    it("Should update state of pending solicitud documento", async () => {
      const response = await request
        .put(
          `/inter-mongo-documentos/entrada/solicitudes-envio?codigoEstablecimiento=HRA`
        )
        .set("Authorization", token)
        .send([
          {
            _id: "303030303030303030303032",
            codigoEstablecimiento: "HRA",
            rutPaciente: "11111111-1",
            identificadorDocumento: "2",
            tipoDocumento: "DAU",
            correlativoSolicitud: 10,
            anio: 2021,
            estado: "EN_PROCESO",
          },
        ]);

      expect(response.status).toBe(200);

      const { respuesta } = response.body;

      expect(respuesta).toEqual([
        {
          afectado: "303030303030303030303032",
          realizado: true,
          error: "",
        },
      ]);

      const solicitudDocumentoActualizada =
        await SolicitudesDocumentos.findById("303030303030303030303032");

      expect(solicitudDocumentoActualizada.codigoEstablecimiento).toBe("HRA");
      expect(solicitudDocumentoActualizada.rutPaciente).toBe("11111111-1");
      expect(solicitudDocumentoActualizada.identificadorDocumento).toBe("2");
      expect(solicitudDocumentoActualizada.tipoDocumento).toBe("DAU");
      expect(solicitudDocumentoActualizada.correlativoSolicitud).toBe(10);
      expect(solicitudDocumentoActualizada.anio).toBe(2021);
      expect(solicitudDocumentoActualizada.estado).toBe("EN_PROCESO");
    });
    it("Should update state of multiple pending solicitudes documento", async () => {
      const response = await request
        .put(
          `/inter-mongo-documentos/entrada/solicitudes-envio?codigoEstablecimiento=HRA`
        )
        .set("Authorization", token)
        .send(solicitudesDocumentosAActualizarSeed);

      expect(response.status).toBe(200);

      const { respuesta } = response.body;

      console.log(respuesta)

      expect(respuesta).toEqual([
        {
          afectado: "303030303030303030303033",
          realizado: true,
          error: "",
        },
        {
          afectado: "303030303030303030303131",
          realizado: false,
          error: "La solicitud de envío de documento no existe.",
        },
        {
          afectado: "303030303030303030303035",
          realizado: true,
          error: "",
        },
        {
          afectado: "303030303030303030303036",
          realizado: true,
          error: "",
        },
      ]);
    });
  });
  describe("DELETE /inter-mongo-documentos/entrada/solicitudes-envio", () => {
    it("Should not delete solicitud documento without token", async () => {
      const solicitudesAntes = SolicitudesDocumentos.find().exec();

      const response = await request.delete(
        `/inter-mongo-documentos/entrada/solicitudes-envio`
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acceso no autorizado.");

      const solicitudesDespues = SolicitudesDocumentos.find().exec();

      expect(solicitudesAntes).toEqual(solicitudesDespues);
    });
    it("Should not get solicitudes documentos with invalid token", async () => {
      const solicitudesAntes = SolicitudesDocumentos.find().exec();

      const response = await request
        .delete(`/inter-mongo-documentos/entrada/solicitudes-envio`)
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acceso no autorizado.");

      const solicitudesDespues = SolicitudesDocumentos.find().exec();

      expect(solicitudesAntes).toEqual(solicitudesDespues);
    });
    it("Should not get solicitudes documentos without codigo establecimiento", async () => {
      const solicitudesAntes = SolicitudesDocumentos.find().exec();

      const response = await request
        .delete(`/inter-mongo-documentos/entrada/solicitudes-envio`)
        .set("Authorization", token);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );

      const solicitudesDespues = SolicitudesDocumentos.find().exec();

      expect(solicitudesAntes).toEqual(solicitudesDespues);
    });
    it("Should delete solicitud documento in progress", async () => {
      const response = await request
        .delete(
          `/inter-mongo-documentos/entrada/solicitudes-envio?codigoEstablecimiento=HRA`
        )
        .set("Authorization", token)
        .send(["303030303030303030303034"]);

      expect(response.status).toBe(200);

      const { respuesta } = response.body;

      expect(respuesta).toEqual([
        {
          afectado: "303030303030303030303034",
          realizado: true,
          error: "",
        },
      ]);

      const solicitudDocumentoEliminada = await SolicitudesDocumentos.findById(
        "303030303030303030303034"
      );

      expect(solicitudDocumentoEliminada).toBeFalsy();
    });
    it("Should delete of multiple solicitudes documento in progress", async () => {
      const response = await request
        .delete(
          `/inter-mongo-documentos/entrada/solicitudes-envio?codigoEstablecimiento=HRA`
        )
        .set("Authorization", token)
        .send(["303030303030303030303037", "303030303030303030303131"]);

      expect(response.status).toBe(200);

      const { respuesta } = response.body;

      expect(respuesta).toEqual([
        {
          afectado: "303030303030303030303037",
          realizado: true,
          error: "",
        },
        {
          afectado: "303030303030303030303131",
          realizado: true,
          error: "La solicitud de envío de documento no existe.",
        },
      ]);
    });
  });
});
