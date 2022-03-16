const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:Junjie1995@localhost:5432/skatepark",
});

const consulta = (text, values) => ({ text, values });

//? Participantes
const getParticipantes = async () => {
  const sqlQuery = "SELECT * FROM skaters";
  try {
    const result = await pool.query(sqlQuery);
    return result.rows;
  } catch (error) {
    console.log(err.code);
    return error;
  }
};

//? Crea participante
const postParticipantes = async (data) => {
  const sqlQuery =
    "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING*";
  const values = data;
  try {
    const result = await pool.query(consulta(sqlQuery, values));
    return result.rows;
  } catch (error) {
    console.log(error.code);
    return error;
  }
};

module.exports = { getParticipantes, postParticipantes };
