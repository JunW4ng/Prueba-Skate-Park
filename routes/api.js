const { Router } = require("express");
const {
  getParticipantes,
  postParticipantes,
  findParticipante,
  putParticipante,
  deleteParticipante,
} = require("../db");

const router = Router();

router.get("/participantes", async (req, res) => {
  const data = await getParticipantes();
  res.send(data);
});

router.post("/nuevoParticipante", async (req, res) => {
  const { email, nombre, experiencia, especialidad } = req.params;
  const data = { email, nombre, experiencia, especialidad };
  const result = await postParticipantes(data);
  res.send(result);
});

router.put("/set");
router.delete("/delete");

module.exports = router;
