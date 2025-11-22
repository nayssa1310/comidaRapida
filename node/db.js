const mongoose = require("mongoose");
require("dotenv").config();

const conectarDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(" No se encontró MONGO_URI en .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.error(" Error conectando a MongoDB:", error);
    process.exit(1);
  }
};

module.exports = { conectarDB };
