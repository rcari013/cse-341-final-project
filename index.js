const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Mongoose connected to MongoDB"))
  .catch((err) => console.error("Mongoose connection error:", err));

app.listen(port, () => console.log(`Server running on port ${port}`));
