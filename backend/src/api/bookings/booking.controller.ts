import { Request, Response } from 'express';
import * as bookingService from './booking.service';

export async function getBookings(req: Request, res: Response) {
  try {
    const bookings = await bookingService.getBookings(req.query);
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getBookingById(req: Request, res: Response) {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createBooking(req: Request, res: Response) {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateBooking(req: Request, res: Response) {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteBooking(req: Request, res: Response) {
  try {
    await bookingService.deleteBooking(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
