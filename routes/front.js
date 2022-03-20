require("dotenv").config();
const { Router } = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
  getParticipantes,
  postParticipantes,
  findParticipante,
  putParticipante,
  deleteParticipante,
} = require("../db");

const { JWT_SECRET, JWT_TTL } = process.env;

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

//? Muestra participantes
router.get("/", async (_, res) => {
  try {
    const data = await getParticipantes();
    res.render("index", { participantes: data });
  } catch (error) {
    console.log(error);
    res.status(404).send("No Encontrado");
  }
});

//? Vistas
router.get("/login", async (req, res) => res.render("login", req));
router.get("/registro", async (_, res) => res.render("registro"));

//? Registro de participante
router.post("/register", async (req, res) => {
  try {
    const { email, nombre, password, experiencia, especialidad, foto } =
      req.body;
    const estado = "FALSE"; // Setea default de estado
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
    res.status(404).send("No Encontrado");
  }
});

//? Login participante
router.post("/signIn", async (req, res) => {
  try {
    const { inputEmail, inputPassword } = req.body;
    const result = await findParticipante(inputEmail);
    const { id, email, nombre, password, anos_experiencia, especialidad } =
      result[0];

    if (inputEmail === email && inputPassword === password) {
      const token = jwt.sign(
        { id, email, nombre, password, anos_experiencia, especialidad },
        JWT_SECRET,
        {
          expiresIn: JWT_TTL,
        }
      );
      res.cookie("id", id);
      res.cookie("token", token).redirect("/verified");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error servidor");
  }
});

//? Verifica
router.use("/verified", (req, res, next) => {
  try {
    jwt.verify(req.cookies.token, JWT_SECRET, (err, data) => {
      req.skater = data;
    });
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("No esta permitido");
  }
});

//? Post verificado levanta pagina de datos
router.get("/verified", async (req, res) => {
  try {
    const { email, nombre, password, anos_experiencia, especialidad } =
      req.skater;
    res.render("datos", {
      email: email,
      nombre: nombre,
      password: password,
      experiencia: anos_experiencia,
      especialidad: especialidad,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send("No Encontrado");
  }
});

//? Actualiza datos
router.post("/updateUser", async (req, res) => {
  try {
    const { nombre, password, experiencia, especialidad } = req.body;
    const { id } = req.cookies;
    const data = { nombre, password, experiencia, especialidad, id };
    await putParticipante(Object.values(data));
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(404).send("No Encontrado");
  }
});

//? Elimina cuenta
router.get("/deleteUser", async (req, res) => {
  try {
    const { id } = req.cookies;
    await deleteParticipante(id);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(404).send("No Encontrado");
  }
});

//? Vista ADMIN
router.get("/admin", async (_, res) => {
  try {
    const data = await getParticipantes();
    res.render("admin", { participantes: data });
  } catch (error) {
    console.log(error);
    res.status(404).send("No Encontrado");
  }
});

module.exports = router;
