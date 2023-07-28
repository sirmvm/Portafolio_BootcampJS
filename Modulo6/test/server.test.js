const chai = require("chai");
const chaiHttp = require("chai-http");
const { server } = require("../index");
const { before, beforeEach, after } = require("mocha");
const fs = require("fs/promises");

chai.use(chaiHttp);

describe("Respuesta servidor", () => {
  it("Verificando que servidor este activo", (done) => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.text, "Prueba consolidada 6");
        done();
      });
  });
});

describe("Probando el crud", () => {
  let backupData;
  let data, autoIndex;
  before(async () => {
    try {
      backupData = await fs.readFile("./anime.test.json", "utf-8");
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      data = await fs.readFile("./anime.test.json", "utf-8");
      data = JSON.parse(data);
      autoIndex = await fs.readFile("./auto_index.test.txt", "utf-8");
      autoIndex = parseInt(autoIndex);
    } catch (error) {
      console.log(error);
    }
  });

  after(async () => {
    try {
      await fs.writeFile("./anime.test.json", backupData, "utf-8");
      await fs.access("./auto_index.test.txt");
      await fs.rm("./auto_index.test.txt");
    } catch (error) {
      console.log(error);
    }
  });

  it("Comprobando respuesta Get  - id", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime")
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.text, JSON.stringify(data));
        done();
      });
  });

  it("Verificando respuesta GET + id ", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime?id=1")
      .end((err, res) => {
        const expectedData = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => key === "1")
        );

        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Verificando respuesta GET + nombre", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime?nombre=Akira")
      .end((err, res) => {
        const expectedData = Object.fromEntries(
          Object.entries(data).filter(
            ([key, value]) => value.nombre === "Akira"
          )
        );

        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Verificando respuesta GET + id y nombre", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime?id=1&nombre=Akira")
      .end((err, res) => {
        const expectedData = Object.fromEntries(
          Object.entries(data).filter(
            ([key, value]) => value.nombre === "Akira" && key === "1"
          )
        );

        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Verificando respuesta GET + id y nombre con error", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime?id=1000&nombre=NoExiste")
      .end((err, res) => {
        const expectedData = Object.fromEntries(
          Object.entries(data).filter(
            ([key, value]) => value.nombre === "Akira" && key === "1"
          )
        );
        chai.assert.equal(res.status, 404);
        chai.assert.equal(res.text, "No resultados");
        done();
      });
  });

  it("Verificando respuesta POST", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      año: 2023,
      autor: "Author Test",
    };

    let expectedData = structuredClone(data);
    expectedData[(autoIndex + 1).toString()] = newEntry;

    chai
      .request(server)
      .post("/api/v1/anime")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 201);
        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Verificando respuesta a un mal POST", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      //Faltan dos atributos para que sea válida
      // año: 2023,
      // autor: "Author Test",
    };

    let expectedData = structuredClone(data);
    expectedData[(autoIndex + 1).toString()] = newEntry;

    chai
      .request(server)
      .post("/api/v1/anime")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        chai.assert.equal(res.text, "Cuerpo de la solicitud inválido");
        done();
      });
  });

  it("Verificando respuesta PUT", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      año: 2023,
      autor: "Author Test",
    };

    const entryId = "1";

    let expectedData = structuredClone(data);
    expectedData[entryId] = newEntry;

    chai
      .request(server)
      .put("/api/v1/anime?id=1")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Verificando respuesta a un PUT erroneo", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      //Faltan dos atributos para que sea válida
      // año: 2023,
      // autor: "Author Test",
    };

    const entryId = "1";

    let expectedData = structuredClone(data);
    expectedData[entryId] = newEntry;

    chai
      .request(server)
      .put("/api/v1/anime?id=1")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        chai.assert.equal(res.text, "Body inválido");
        done();
      });
  });

  it("Verificando respuesta a un PUT erroneo sin id", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      año: 2023,
      autor: "Author Test",
    };

    const entryId = "1";

    let expectedData = structuredClone(data);
    expectedData[entryId] = newEntry;

    chai
      .request(server)
      .put("/api/v1/anime")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        chai.assert.equal(
          res.text,
          "No se ha especificado un id para actualizar"
        );
        done();
      });
  });

  it("Verificando respuesta a un PUT erroneo con id no existente", (done) => {
    const entryId = "1000";
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      año: 2023,
      autor: "Author Test",
    };

    chai
      .request(server)
      .put("/api/v1/anime?id=" + entryId)
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 404);
        chai.assert.equal(
          res.text,
          "No se ha encontrado anime con id: " + entryId
        );
        done();
      });
  });

  it("Verificando respuesta DELETE", (done) => {
    const entryId = "1";
    let expectedData = structuredClone(data);
    delete expectedData[entryId];
    chai
      .request(server)
      .delete("/api/v1/anime?id=1")
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Verificando respuesta DELETE erroneo sin id", (done) => {
    chai
      .request(server)
      .delete("/api/v1/anime")
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        chai.assert.equal(
          res.text,
          "No se ha especificado un id para eliminar"
        );
        done();
      });
  });

  it("Verificando respuesta DELETE erroneo + id no existente", (done) => {
    const entryId = "1000";
    chai
      .request(server)
      .delete("/api/v1/anime?id=" + entryId)
      .end((err, res) => {
        chai.assert.equal(res.status, 404);
        chai.assert.equal(
          res.text,
          "No se ha encontrado anime con id: " + entryId
        );
        done();
      });
  });

  it("Verificando respuesta a solicitud DELETE con datos originales", (done) => {
    let previousData = structuredClone(data);
    chai
      .request(server)
      .delete("/api/v1/anime?id=2") 
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.notEqual(res.text, previousData);
        done();
      });
  });
});
