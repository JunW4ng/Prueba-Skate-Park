require("dotenv").config();
const { Router } = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
  getParticipantes,
  postParticipantes,
  findParticipante,
} = require("../db");

const { JWT_SECRET, JWT_TTL } = process.env;

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

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
  try {
    const { email, nombre, password, experiencia, especialidad, foto } =
      req.body;
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
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

//? Login participante
router.post("/signIn", async (req, res) => {
  try {
    const { inputEmail, inputPassword } = req.body;
    const result = await findParticipante(inputEmail);
    const { email, nombre, password, anos_experiencia, especialidad } =
      result[0];

    if (inputEmail === email && inputPassword === password) {
      const token = jwt.sign(
        { email, nombre, password, anos_experiencia, especialidad },
        JWT_SECRET,
        {
          expiresIn: JWT_TTL,
        }
      );
      res.cookie("token", token).redirect("/verified");
    }
  } catch (error) {
    console.log(error);
  }
});

//? Verifica
router.use("/verified", (req, res, next) => {
  try {
    jwt.verify(req.cookies.token, JWT_SECRET, (err, data) => {
      res.cookie("decodedData", data);
    });
    next();
  } catch (error) {
    console.log(error);
  }
});

//? Post verificado levanta pagina de datos
router.get("/verified", (req, res) => {
  const { email, nombre, password, anos_experiencia, especialidad } =
    req.cookies.decodedData;
  res.render("datos", {
    email: email,
    nombre: nombre,
    password: password,
    experiencia: anos_experiencia,
    especialidad: especialidad,
  });
});

router.get("/admin", async (req, res) => {
  res.render("admin");
});

module.exports = router;
