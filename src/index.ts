import express from 'express';

import UserRoutes from './routes/users.routes.js';
import { port } from './config.js';

const app = express();

// Middleware per il parsing del corpo delle richieste
app.use(express.json());

// cors headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api', UserRoutes);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
