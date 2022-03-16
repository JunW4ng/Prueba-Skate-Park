const { Router } = require("express");
const { getParticipantes, postParticipantes } = require("../db");
const bodyParser = require("body-parser");

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//! Hacer logica de estado (aprobado o en revision)
//? Muestra participantes
router.get("/", async (req, res) => {
  const data = await getParticipantes();
  res.render("index", { participantes: data });
});

//? Vistas
router.get("/login", async (req, res) => res.render("login", req));
router.get("/registro", async (req, res) => res.render("registro"));

//? Registro de participante
router.post("/register", async (req, res) => {
  const { email, nombre, password, experiencia, especialidad, foto } = req.body;
  const estado = "FALSE"; //? Setea default de estado
  const data = {
    email,
    nombre,
    password,
    experiencia,
    especialidad,
    foto,
    estado,
  };
  await postParticipantes(Object.values(data));
  res.redirect('/')
});

router.get("/datos", (req, res) => {
  res.render("datos");
});

router.get("/admin", async (req, res) => {
  res.render("admin");
});

module.exports = router;
