import config from './config.js';
import { connect } from 'mongoose';

const MONGO_URI = config.MONGO_URI;
await connect(MONGO_URI)
  .then(() => { console.log("✅ Conectado al Servidor de MongoDB.") })
  .catch((error) => { console.log("❌ Ups, ocurrió un error intentar conectaro con el Servidor de MongoDB:\n" + error) });
