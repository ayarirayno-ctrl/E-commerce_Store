import mongoose from 'mongoose';

const DEFAULT_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const DEFAULT_OPTIONS = {
  // Pool settings
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '0', 10),
  // Timeouts
  serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || '5000', 10),
  connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT_MS || '10000', 10),
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT_MS || '45000', 10),
  // Use unified topology features (mongoose v6+ default, kept explicit)
  // other options can be added as needed
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const connectDatabase = async () => {
  const maxAttempts = parseInt(process.env.MONGODB_CONNECT_ATTEMPTS || '5', 10);
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      attempt += 1;
      console.log(`MongoDB: attempt ${attempt} to connect to ${DEFAULT_URI}`);

      const connection = await mongoose.connect(DEFAULT_URI, DEFAULT_OPTIONS as any);

      console.log(`MongoDB Connected: ${connection.connection.host}`);
      // Improve debugging: show pool size
      // @ts-ignore - mongoose typings for client are internal
      const clientInfo = (connection.connection as any).client?.topology?.s?.options || {};
      console.log('MongoDB connection options:', clientInfo);
      return connection;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, (error as Error).message || error);

      if (attempt >= maxAttempts) {
        console.error('Exceeded maximum MongoDB connection attempts. Exiting.');
        process.exit(1);
      }

      // Exponential backoff with jitter
      const backoffMs = Math.min(30000, 2 ** attempt * 1000) + Math.floor(Math.random() * 1000);
      console.log(`Waiting ${backoffMs} ms before retrying...`);
      // eslint-disable-next-line no-await-in-loop
      await wait(backoffMs);
    }
  }
};