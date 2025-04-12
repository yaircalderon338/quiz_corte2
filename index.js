const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/prueba", (req, res) => {
  res.send("API funcionando correctamente");
});

// ==================== FUNCIONES AUXILIARES ====================
const validarCampos = (campos, res) => {
  for (const campo in campos) {
    if (!campos[campo]) {
      res.status(400).json({ message: `El campo '${campo}' es obligatorio` });
      return false;
    }
  }
  return true;
};

// ==================== PERSONA ====================
app.get("/api/personas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM persona");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al consultar personas", error: error.message });
  }
});

app.post("/api/personas", async (req, res) => {
  const { nombre, apellido1, apellido2, dni } = req.body;
  if (!validarCampos({ nombre, apellido1, apellido2, dni }, res)) return;

  try {
    await pool.query(
      "INSERT INTO persona (nombre, apellido1, apellido2, dni) VALUES ($1, $2, $3, $4)",
      [nombre, apellido1, apellido2, dni]
    );
    res.status(201).json({ message: "Persona creada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear persona", error: error.message });
  }
});

app.put("/api/personas/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido1, apellido2, dni } = req.body;
  if (!validarCampos({ nombre, apellido1, apellido2, dni }, res)) return;

  try {
    const result = await pool.query(
      "UPDATE persona SET nombre = $1, apellido1 = $2, apellido2 = $3, dni = $4 WHERE id = $5",
      [nombre, apellido1, apellido2, dni, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: "Persona no encontrada" });

    res.json({ message: "Persona actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar persona", error: error.message });
  }
});

app.delete("/api/personas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM persona WHERE id = $1", [id]);

    if (result.rowCount === 0) return res.status(404).json({ message: "Persona no encontrada" });

    res.json({ message: `Persona con ID ${id} eliminada` });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar persona", error: error.message });
  }
});

// ==================== COCHE ====================
app.get("/api/coches", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM coche");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al consultar coches", error: error.message });
  }
});

app.post("/api/coches", async (req, res) => {
  const { matricula, marca, modelo, caballos, persona_id } = req.body;
  if (!validarCampos({ matricula, marca, modelo, caballos, persona_id }, res)) return;

  try {
    await pool.query(
      "INSERT INTO coche (matricula, marca, modelo, caballos, persona_id) VALUES ($1, $2, $3, $4, $5)",
      [matricula, marca, modelo, caballos, persona_id]
    );
    res.status(201).json({ message: "Coche registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar coche", error: error.message });
  }
});

app.put("/api/coches/:matricula", async (req, res) => {
  const { matricula } = req.params;
  const { marca, modelo, caballos, persona_id } = req.body;
  if (!validarCampos({ marca, modelo, caballos, persona_id }, res)) return;

  try {
    const result = await pool.query(
      "UPDATE coche SET marca = $1, modelo = $2, caballos = $3, persona_id = $4 WHERE matricula = $5",
      [marca, modelo, caballos, persona_id, matricula]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: "Coche no encontrado" });

    res.json({ message: "Coche actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar coche", error: error.message });
  }
});

app.delete("/api/coches/:matricula", async (req, res) => {
  const { matricula } = req.params;

  try {
    const result = await pool.query("DELETE FROM coche WHERE matricula = $1", [matricula]);

    if (result.rowCount === 0) return res.status(404).json({ message: "Coche no encontrado" });

    res.json({ message: `Coche con matrícula ${matricula} eliminado` });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar coche", error: error.message });
  }
});

// ==================== SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
