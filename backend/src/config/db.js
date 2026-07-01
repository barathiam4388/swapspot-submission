import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI est manquant dans les variables d’environnement.');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connecte');
};
