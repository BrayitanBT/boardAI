require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// -------------------- DB --------------------
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// -------------------- JWT --------------------
const JWT_SECRET = process.env.JWT_SECRET || "cambia_esto";

// Helper: crear token
function crearToken(user) {
  return jwt.sign(
    { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Middleware auth (verifica token)
function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ success: false, message: "Token requerido" });
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }
}

// Middleware roles: acepta array de roles permitidos
function rolesPermitidos(allowed = []) {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.rol)) {
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }
    next();
  };
}

// -------------------- AUTH: register / login --------------------
app.post("/register", async (req, res) => {
  try {
    const { nombre, email, contrasena, rol } = req.body;
    if (!nombre || !email || !contrasena || !rol) {
      return res.status(400).json({ success: false, message: "Faltan datos" });
    }
    // verificar rol válido
    if (!["estudiante", "profesor"].includes(rol)) {
      return res.status(400).json({ success: false, message: "Rol inválido" });
    }

    const [exists] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (exists.length) return res.status(400).json({ success: false, message: "Email ya registrado" });

    const hash = await bcrypt.hash(contrasena, 10);
    await db.query("INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)", [nombre, email, hash, rol]);

    return res.json({ success: true, message: "Usuario registrado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    if (!email || !contrasena) return res.status(400).json({ success: false, message: "Faltan datos" });

    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ success: false, message: "Usuario no encontrado" });

    const user = rows[0];
    const ok = await bcrypt.compare(contrasena, user.contrasena);
    if (!ok) return res.status(401).json({ success: false, message: "Credenciales inválidas" });

    const token = crearToken(user);
    return res.json({ success: true, token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

// -------------------- MATERIAS --------------------
// Crear materia (solo profesor)
app.post("/materias", auth, rolesPermitidos(["profesor"]), async (req, res) => {
  try {
    const { nombre, descripcion, codigo } = req.body;
    const profesor_id = req.user.id;

    if (!nombre) return res.status(400).json({ success: false, message: "Nombre requerido" });

    await db.query("INSERT INTO materias (nombre, descripcion, codigo, profesor_id) VALUES (?, ?, ?, ?)", [nombre, descripcion || null, codigo || null, profesor_id]);
    return res.json({ success: true, message: "Materia creada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Listar todas las materias (cualquiera autenticado)
app.get("/materias", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT m.*, u.nombre AS profesor_nombre FROM materias m JOIN usuarios u ON m.profesor_id = u.id");
    return res.json({ success: true, materias: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

// Obtener materia por id
app.get("/materias/:id", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM materias WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Materia no encontrada" });
    return res.json({ success: true, materia: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

// Actualizar materia (solo profesor que la creó)
app.put("/materias/:id", auth, rolesPermitidos(["profesor"]), async (req, res) => {
  try {
    const materiaId = req.params.id;
    const profesor_id = req.user.id;
    // verificar que el profesor es dueño de la materia
    const [rows] = await db.query("SELECT * FROM materias WHERE id = ?", [materiaId]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Materia no encontrada" });
    if (rows[0].profesor_id !== profesor_id) return res.status(403).json({ success: false, message: "No eres el profesor de esta materia" });

    const { nombre, descripcion, codigo } = req.body;
    await db.query("UPDATE materias SET nombre = ?, descripcion = ?, codigo = ? WHERE id = ?", [nombre || rows[0].nombre, descripcion || rows[0].descripcion, codigo || rows[0].codigo, materiaId]);
    return res.json({ success: true, message: "Materia actualizada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Eliminar materia (solo profesor dueño)
app.delete("/materias/:id", auth, rolesPermitidos(["profesor"]), async (req, res) => {
  try {
    const materiaId = req.params.id;
    const profesor_id = req.user.id;
    const [rows] = await db.query("SELECT * FROM materias WHERE id = ?", [materiaId]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Materia no encontrada" });
    if (rows[0].profesor_id !== profesor_id) return res.status(403).json({ success: false, message: "No eres el profesor de esta materia" });

    await db.query("DELETE FROM materias WHERE id = ?", [materiaId]);
    return res.json({ success: true, message: "Materia eliminada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- INSCRIPCIONES --------------------
// Inscribirse (estudiante)
app.post("/inscripciones", auth, rolesPermitidos(["estudiante"]), async (req, res) => {
  try {
    const estudiante_id = req.user.id;
    const { materia_id } = req.body;
    if (!materia_id) return res.status(400).json({ success: false, message: "materia_id requerido" });

    await db.query("INSERT INTO inscripciones (estudiante_id, materia_id) VALUES (?, ?)", [estudiante_id, materia_id]);
    return res.json({ success: true, message: "Inscripción exitosa" });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ success: false, message: "Ya estás inscrito" });
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Salir de materia (estudiante)
app.delete("/inscripciones/:materia_id", auth, rolesPermitidos(["estudiante"]), async (req, res) => {
  try {
    const estudiante_id = req.user.id;
    const materia_id = req.params.materia_id;
    await db.query("DELETE FROM inscripciones WHERE estudiante_id = ? AND materia_id = ?", [estudiante_id, materia_id]);
    return res.json({ success: true, message: "Te saliste de la materia" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Listar materias del estudiante autenticado
app.get("/mi/materias", auth, rolesPermitidos(["estudiante"]), async (req, res) => {
  try {
    const estudiante_id = req.user.id;
    const [rows] = await db.query(`
      SELECT m.* FROM materias m
      JOIN inscripciones i ON m.id = i.materia_id
      WHERE i.estudiante_id = ?
    `, [estudiante_id]);
    return res.json({ success: true, materias: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- TAREAS --------------------
// Crear tarea (profesor dueño de la materia)
app.post("/tareas", auth, rolesPermitidos(["profesor"]), async (req, res) => {
  try {
    const profesor_id = req.user.id;
    const { materia_id, titulo, descripcion, fecha_entrega, archivo_url } = req.body;

    if (!materia_id || !titulo) return res.status(400).json({ success: false, message: "Faltan datos" });

    // verificar profesor dueño
    const [mRows] = await db.query("SELECT * FROM materias WHERE id = ?", [materia_id]);
    if (!mRows.length) return res.status(404).json({ success: false, message: "Materia no encontrada" });
    if (mRows[0].profesor_id !== profesor_id) return res.status(403).json({ success: false, message: "No eres el profesor de esta materia" });

    await db.query("INSERT INTO tareas (materia_id, titulo, descripcion, fecha_entrega, archivo_url) VALUES (?, ?, ?, ?, ?)", [materia_id, titulo, descripcion || null, fecha_entrega || null, archivo_url || null]);
    return res.json({ success: true, message: "Tarea creada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Listar tareas por materia (cualquiera autenticado si está inscrito o profesor)
app.get("/materias/:id/tareas", auth, async (req, res) => {
  try {
    const materia_id = req.params.id;
    const [rows] = await db.query("SELECT * FROM tareas WHERE materia_id = ?", [materia_id]);
    return res.json({ success: true, tareas: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Actualizar tarea (profesor dueño)
app.put("/tareas/:id", auth, rolesPermitidos(["profesor"]), async (req, res) => {
  try {
    const tareaId = req.params.id;
    const profesor_id = req.user.id;
    const { titulo, descripcion, fecha_entrega, archivo_url } = req.body;

    const [trows] = await db.query("SELECT t.*, m.profesor_id FROM tareas t JOIN materias m ON t.materia_id = m.id WHERE t.id = ?", [tareaId]);
    if (!trows.length) return res.status(404).json({ success: false, message: "Tarea no encontrada" });
    if (trows[0].profesor_id !== profesor_id) return res.status(403).json({ success: false, message: "No eres el profesor de esta materia" });

    await db.query("UPDATE tareas SET titulo = ?, descripcion = ?, fecha_entrega = ?, archivo_url = ? WHERE id = ?", [titulo || trows[0].titulo, descripcion || trows[0].descripcion, fecha_entrega || trows[0].fecha_entrega, archivo_url || trows[0].archivo_url, tareaId]);
    return res.json({ success: true, message: "Tarea actualizada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Eliminar tarea (profesor dueño)
app.delete("/tareas/:id", auth, rolesPermitidos(["profesor"]), async (req, res) => {
  try {
    const tareaId = req.params.id;
    const profesor_id = req.user.id;

    const [trows] = await db.query("SELECT t.*, m.profesor_id FROM tareas t JOIN materias m ON t.materia_id = m.id WHERE t.id = ?", [tareaId]);
    if (!trows.length) return res.status(404).json({ success: false, message: "Tarea no encontrada" });
    if (trows[0].profesor_id !== profesor_id) return res.status(403).json({ success: false, message: "No eres el profesor de esta materia" });

    await db.query("DELETE FROM tareas WHERE id = ?", [tareaId]);
    return res.json({ success: true, message: "Tarea eliminada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- ENTREGAS --------------------
// Estudiante crea entrega (solo estudiante)
app.post("/entregas", auth, rolesPermitidos(["estudiante"]), async (req, res) => {
  try {
    const estudiante_id = req.user.id;
    const { tarea_id, contenido, archivo_url } = req.body;

    if (!tarea_id) return res.status(400).json({ success: false, message: "tarea_id requerido" });

    await db.query("INSERT INTO entregas (tarea_id, estudiante_id, contenido, archivo_url) VALUES (?, ?, ?, ?)", [tarea_id, estudiante_id, contenido || null, archivo_url || null]);
    return res.json({ success: true, message: "Entrega enviada" });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ success: false, message: "Ya entregaste esta tarea" });
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Profesor ve entregas de una tarea (solo profesor dueño)
app.get("/tareas/:id/entregas", auth, rolesPermitidos(["profesor"]), async (req, res) => {
  try {
    const tareaId = req.params.id;
    // verificar profesor dueño
    const [trows] = await db.query("SELECT t.*, m.profesor_id FROM tareas t JOIN materias m ON t.materia_id = m.id WHERE t.id = ?", [tareaId]);
    if (!trows.length) return res.status(404).json({ success: false, message: "Tarea no encontrada" });
    if (trows[0].profesor_id !== req.user.id) return res.status(403).json({ success: false, message: "No eres el profesor de esta materia" });

    const [rows] = await db.query("SELECT e.*, u.nombre AS estudiante_nombre FROM entregas e JOIN usuarios u ON e.estudiante_id = u.id WHERE e.tarea_id = ?", [tareaId]);
    return res.json({ success: true, entregas: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Profesor califica entrega (solo profesor)
app.put("/entregas/:id/calificar", auth, rolesPermitidos(["profesor"]), async (req, res) => {
  try {
    const entregaId = req.params.id;
    const { calificacion, comentario_profesor } = req.body;

    // Verificar que el profesor es dueño de la tarea
    const [erows] = await db.query(`
      SELECT e.*, t.materia_id, m.profesor_id 
      FROM entregas e 
      JOIN tareas t ON e.tarea_id = t.id 
      JOIN materias m ON t.materia_id = m.id 
      WHERE e.id = ?
    `, [entregaId]);

    if (!erows.length) {
      return res.status(404).json({ success: false, message: "Entrega no encontrada" });
    }

    if (erows[0].profesor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "No eres el profesor de esta materia" });
    }

    await db.query(`
      UPDATE entregas 
      SET calificacion = ?, comentario_profesor = ? 
      WHERE id = ?
    `, [calificacion || null, comentario_profesor || null, entregaId]);

    return res.json({ success: true, message: "Entrega calificada" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});


// Estudiante lista sus entregas
app.get("/mi/entregas", auth, rolesPermitidos(["estudiante"]), async (req, res) => {
  try {
    const estudiante_id = req.user.id;
    const [rows] = await db.query("SELECT e.*, t.titulo FROM entregas e JOIN tareas t ON e.tarea_id = t.id WHERE e.estudiante_id = ?", [estudiante_id]);
    return res.json({ success: true, entregas: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- COMENTARIOS --------------------
// Listar comentarios por tarea (cualquiera autenticado)
app.get("/tareas/:id/comentarios", auth, async (req, res) => {
  try {
    const tarea_id = req.params.id;
    const [rows] = await db.query(
      `SELECT c.id, c.comentario, c.creado_en, u.id as usuario_id, u.nombre as usuario_nombre, u.rol
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.tarea_id = ?
       ORDER BY c.creado_en ASC`,
      [tarea_id]
    );
    return res.json({ success: true, comentarios: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Crear comentario (cualquiera autenticado)
app.post("/tareas/:id/comentarios", auth, async (req, res) => {
  try {
    const tarea_id = req.params.id;
    const usuario_id = req.user.id;
    const { comentario } = req.body;
    if (!comentario) return res.status(400).json({ success: false, message: "Comentario vacío" });

    await db.query("INSERT INTO comentarios (tarea_id, usuario_id, comentario) VALUES (?, ?, ?)", [tarea_id, usuario_id, comentario]);
    return res.json({ success: true, message: "Comentario creado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Eliminar comentario (solo profesor creador de la materia o autor del comentario)
app.delete("/comentarios/:id", auth, async (req, res) => {
  try {
    const comentarioId = req.params.id;
    const usuarioId = req.user.id;

    const [rows] = await db.query(
      `SELECT c.*, t.materia_id, m.profesor_id
       FROM comentarios c
       JOIN tareas t ON c.tarea_id = t.id
       JOIN materias m ON t.materia_id = m.id
       WHERE c.id = ?`,
      [comentarioId]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: "Comentario no encontrado" });

    const comentario = rows[0];
    if (comentario.usuario_id !== usuarioId && comentario.profesor_id !== usuarioId) {
      return res.status(403).json({ success: false, message: "No tienes permiso para eliminar este comentario" });
    }

    await db.query("DELETE FROM comentarios WHERE id = ?", [comentarioId]);
    return res.json({ success: true, message: "Comentario eliminado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto " + PORT);
});

