const { Router } = require("express");
const bodyParser = require("body-parser");
const {
  getParticipantes,
  postParticipantes,
  putParticipante,
  deleteParticipante,
} = require("../db");

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//? Muestra todos los participantes
router.get("/api/participantes", async (_, res) => {
  try {
    const data = await getParticipantes();
    res.send(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

//? Crea un participante
router.post("/api/nuevo/participante", async (req, res) => {
  try {
    const {
      email,
      nombre,
      password,
      anos_experiencia,
      especialidad,
      foto,
      estado,
    } = req.body;
    const data = {
      email,
      nombre,
      password,
      anos_experiencia,
      especialidad,
      foto,
      estado,
    };
    const result = await postParticipantes(Object.values(data));
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//? Modifica un participante
router.put("/api/edit/participante", async (req, res) => {
  try {
    const { nombre, password, anos_experiencia, especialidad, id } = req.body;
    const data = {
      nombre,
      password,
      anos_experiencia,
      especialidad,
      id,
    };
    const result = await putParticipante(Object.values(data));
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//? Borra un participante
router.delete("/api/delete/participante/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteParticipante(id);

    result > 0
      ? res.send(`El participante con id: ${id}, fue elimninado con exito`)
      : res.send(`No existe participante con id: ${id}`);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
