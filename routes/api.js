const { Router } = require("express");
const { getParticipantes } = require("../db");

const router = Router();

router.get("/participantes", async(req, res) => {
  const data = await getParticipantes();
  res.send(data);
});

module.exports = router;
