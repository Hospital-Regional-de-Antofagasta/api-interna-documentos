const supertest = require("supertest");
const app = require("../api/index");
const mongoose = require("mongoose");
const Documentos = require("../api/models/Documentos");
const documentosSeed = require("../api/testSeeds/documentosSeed.json");

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

describe("Endpoints documentos", () => {
  describe("Get last documento", () => {
    it("Should not get last documento without token", async () => {
    });
    it("Should get no last documento from empty database", async () => {
    });
    it("Should get last documento", async () => {
    });
  });
  describe("Create documento", () => {
    it("Should not create documento without token", async () => {});
    it("Should create documento", async () => {});
  });
  describe("Delete documento", () => {
    it("Should not delete documento without token", async () => {});
    it("Should not delete documento if it does not exists", async () => {});
    it("Should delete documento", async () => {});
  });
});
