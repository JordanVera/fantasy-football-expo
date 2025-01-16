import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import routes from './routes/index.js';
import helmet from 'helmet';
import webhookRoutes from './routes/webhook.js';

dotenv.config();
const app = express();

// Increase the timeout for webhook processing
app.timeout = 120000; // 2 minutes

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Mount webhook routes before body parser
app.use('/api/webhook', webhookRoutes);

// JSON body parser for all other routes
app.use(express.json());

// Mount all other routes under /api
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.rainbow.bold);
});
