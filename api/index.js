import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://residenceradar-mh1u.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
}));

// --- SECURITY MIDDLEWARE ---
// --- SECURITY MIDDLEWARE ---
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         connectSrc: [
//           "'self'",
//           "https://firebasestorage.googleapis.com",
//           "https://*.firebaseio.com",
//           "https://*.googleapis.com",
//           "https://accounts.google.com",
//           "https://apis.google.com"
//         ],
//         imgSrc: [
//           "'self'",
//           "data:",
//           "https://firebasestorage.googleapis.com",
//           "https://*.firebaseio.com",
//           "https://*.googleusercontent.com"
//         ],
//         scriptSrc: [
//           "'self'",
//           "https://apis.google.com",
//           "https://accounts.google.com",
//           "https://*.googleapis.com"
//         ],
//         frameSrc: [
//           "'self'",
//           "https://accounts.google.com"
//         ],
//         styleSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "https://fonts.googleapis.com"
//         ],
//         fontSrc: [
//           "'self'",
//           "https://fonts.gstatic.com"
//         ],
//         // Add other directives as needed
//       },
//     },
//   })
// );



// --- JSON & COOKIE MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser());

// --- API ROUTES ---
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// --- STATIC FILES ---
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// --- CATCH-ALL ROUTE FOR REACT ROUTER ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// --- DATABASE CONNECTION & SERVER START ---
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO)
.then(() => {
  console.log('Connected to MongoDB :D');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
