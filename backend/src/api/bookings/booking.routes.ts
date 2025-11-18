import { Router } from 'express';
import * as bookingController from './booking.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, bookingController.getBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.post('/', authenticate, bookingController.createBooking);
router.put('/:id', authenticate, bookingController.updateBooking);
router.delete('/:id', authenticate, bookingController.deleteBooking);

export default router;
