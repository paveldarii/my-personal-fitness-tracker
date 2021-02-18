const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
//require("./seeders/seed"); // or npm run seed

const PORT = process.env.PORT || 8080;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitness_DB", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

require("./routes/html-routes")(app);
require("./routes/api-routes")(app);

app.listen(PORT, () => {
  console.log(`App running on port http://localhost:${PORT}`);
});
