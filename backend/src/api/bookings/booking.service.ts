import prisma from '../../config/prisma';
import { io } from '../../server';

export async function getBookings(query: any) {
  const { hotelId, roomId, status } = query;
  const where: any = {};
  if (hotelId) where.hotel_id = hotelId;
  if (roomId) where.room_id = roomId;
  if (status) where.status = status;

  return prisma.booking.findMany({ where });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({ where: { id } });
}

export async function createBooking(data: any) {
  const booking = await prisma.booking.create({ data });
  io.emit('booking:created', booking);
  return booking;
}

export async function updateBooking(id: string, data: any) {
  const booking = await prisma.booking.update({ where: { id }, data });
  io.emit('booking:updated', booking);
  return booking;
}

export async function deleteBooking(id: string) {
  const booking = await prisma.booking.delete({ where: { id } });
  io.emit('booking:cancelled', { id });
  return booking;
}
