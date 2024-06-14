import express from 'express';
import userRoutes from './routes/userRoutes';
import orgRoutes from './routes/orgRoutes';
import donationRoutes from './routes/donationRoutes';

const app = express();
app.use(express.json());

app.use('/user', userRoutes);
app.use('/org', orgRoutes);
app.use('/donation', donationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
