import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/proyecto-backend-ii")
  .then(() => {
    console.log("Conectado a mongo.");
  })
  .catch((error) => {
    console.log("Ups, NO conectado a mongo:\n" + error);
  });
