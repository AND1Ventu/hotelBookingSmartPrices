import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Adjust for production
  },
});

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './api/auth/auth.routes';
import hotelRoutes from './api/hotels/hotel.routes';
import roomRoutes from './api/rooms/room.routes';
import bookingRoutes from './api/bookings/booking.routes';
import pricingRoutes from './api/pricing/pricing.routes';
import dashboardRoutes from './api/dashboard/dashboard.routes';
import guestRoutes from './api/guests/guest.routes';
import paymentRoutes from './api/payments/payment.routes';
import reportRoutes from './api/reports/report.routes';

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { io };