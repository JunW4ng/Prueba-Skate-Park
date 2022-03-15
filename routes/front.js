const { Router } = require("express");
const { getParticipantes } = require("../db");

const router = Router();

//! Hacer logica de estado
//? Muestra participantes
router.get("/", async (req, res) => {
  const data = await getParticipantes();
  res.render("index", { participantes: data });
});

router.get("/login", async (req, res) => {
  //const {} = req.body
  res.render("login");
});

router.get("/registro", async (req, res) => {
  res.render("registro");
});

router.get("/datos", (req, res) => {
  res.render("datos");
});

router.get("/admin", async (req, res) => {
  res.render("admin");
});

module.exports = router;
