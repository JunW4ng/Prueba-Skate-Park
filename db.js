const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:Junjie1995@localhost:5432/skatepark",
});

const queries = (text, values) => ({ text, values });

//? Participantes
const getParticipantes = () =>
  pool.query("SELECT * FROM skaters").then((res) => res.rows);

//? Crea participante
const postParticipantes = () =>
  pool
    .query(
      "INSERT INTO skaters (email, nombre, password, anos_experencia, especialidad, foto, estado) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING*"
    )
    .then((res) => res.rows);

module.exports = { getParticipantes };
