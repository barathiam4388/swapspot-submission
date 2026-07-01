import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import { setSocketServer } from './utils/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

setSocketServer(io);

io.on('connection', (socket) => {
  socket.on('user:join', (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
    }
  });
});

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ message: 'L’API SwapSpot fonctionne.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur.' });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Serveur en ecoute sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Echec du demarrage :', error.message);
    process.exit(1);
  }
};

startServer();
