require("dotenv").config();
const { Router } = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
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
router.use(fileUpload()); //! configurar mb max

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

//? Subida de foto
/* router.post("register", (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  sampleFile = req.files.foto;
  uploadPath = __dirname + "../public/images" + sampleFile.name;

  sampleFile.mv(uploadPath, (err) => {
    if (err) res.status(500).send(err);
  });
}); */

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
  try {
    const { email, nombre, password, anos_experiencia, especialidad } =
      req.cookies.decodedData;
    res.render("datos", {
      email: email,
      nombre: nombre,
      password: password,
      experiencia: anos_experiencia,
      especialidad: especialidad,
    });
  } catch (error) {
    console.log(error);
  }
});

//? Actualiza datos
router.post("/updateUser", async (req, res) => {
  try {
    const { nombre, password, experiencia, especialidad } = req.body;
    const { id } = req.cookies.decodedData;
    const data = { nombre, password, experiencia, especialidad, id };
    await putParticipante(Object.values(data));
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

//TODO
//? Elimina cuenta
router.delete("/deleteUser", async (req, res) => {
  const { id } = req.cookies.decodedData;
  await deleteParticipante(id);
  res.redirect("/");
});

//? Vista ADMIN
router.get("/admin", async (req, res) => {
  const data = await getParticipantes();
  res.render("admin", { participantes: data });
});

module.exports = router;
