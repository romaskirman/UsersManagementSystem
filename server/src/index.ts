import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { FRONTEND_URL, mailer } from './lib.js';

const app = express();

const allowedOrigins = [
  FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

mailer.verify()
.then(() => console.log('SMTP verify ok'))
    .catch((err) => console.error('SMTP verify failed:', err));

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});