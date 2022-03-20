const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const consulta = (text, values) => ({ text, values });

//? Participantes
const getParticipantes = async () => {
  const sqlQuery = "SELECT * FROM skaters";
  try {
    const result = await pool.query(sqlQuery);
    return result.rows;
  } catch (error) {
    console.log(error.code);
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

//? Busca participante
const findParticipante = async (email) => {
  const sqlQuery = "SELECT * FROM skaters WHERE email = $1";
  const values = [email];
  try {
    const result = await pool.query(consulta(sqlQuery, values));
    return result.rows;
  } catch (error) {
    console.log(error.code);
    return error;
  }
};

//? Modifica participante
const putParticipante = async (data) => {
  const sqlQuery =
    "UPDATE skaters SET nombre = $1, password = $2, anos_experiencia = $3, especialidad = $4 WHERE id = $5 RETURNING*";
  const values = data;
  try {
    const result = await pool.query(consulta(sqlQuery, values));
    return result.rows;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//? Elimina participante
const deleteParticipante = async (id) => {
  const sqlQuery = "DELETE FROM skaters WHERE id = $1 RETURNING*";
  const value = [id];
  try {
    const result = await pool.query(consulta(sqlQuery, value));
    return result.rowCount;
  } catch (error) {
    console.log(error.code);
    return error;
  }
};

module.exports = {
  getParticipantes,
  postParticipantes,
  findParticipante,
  putParticipante,
  deleteParticipante,
};
