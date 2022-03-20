const express = require("express");
const { engine } = require("express-handlebars");
const api = require("./routes/api");
const front = require("./routes/front");

const port = process.env.PORT || 3000;
const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));

app.use(api);
app.use(front);

app.listen(port, () => console.log(`*** Escuchando puerto ${port}`));
