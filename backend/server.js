import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`[Server] Lead Manager Backend API running on port ${PORT}`);
});

export default server;
