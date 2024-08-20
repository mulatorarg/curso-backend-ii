import mongoose from "mongoose";

//mongoose.connect("mongodb+srv://campogabriel:BrY7yMcnp3OUo5Jw@cluster0.2ltylis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mongoose.connect("mongodb://localhost:27017")
  .then(() => {
    console.log("Conectado a mongo.");
  })
  .catch((error) => {
    console.log("Ups, NO conectado a mongo:\n" + error);
  });
