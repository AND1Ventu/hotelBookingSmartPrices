import prisma from '../../config/prisma';
import { startOfToday, endOfToday, startOfMonth, endOfMonth, addDays, startOfWeek, endOfWeek } from 'date-fns';

export async function getKpis(hotelId: string) {
  const today = new Date();
  const rooms = await prisma.room.findMany({ where: { hotel_id: hotelId, is_active: true } });
  const totalRooms = rooms.length;

  const todaysBookings = await prisma.booking.findMany({
    where: {
      hotel_id: hotelId,
      check_in: { lte: endOfToday(), gte: startOfToday() },
      status: { in: ['confirmed', 'checked_in'] },
    },
  });

  const monthlyBookings = await prisma.booking.findMany({
    where: {
      hotel_id: hotelId,
      check_in: { lte: endOfMonth(today), gte: startOfMonth(today) },
      status: { in: ['confirmed', 'checked_in'] },
    },
  });

  const todayRevenue = todaysBookings.reduce((sum, b) => sum + Number(b.total_price), 0);
  const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + Number(b.total_price), 0);

  const occupiedRooms = await prisma.booking.count({
    where: {
      hotel_id: hotelId,
      check_in: { lte: today },
      check_out: { gt: today },
      status: { in: ['confirmed', 'checked_in'] },
    }
  });
  const occupancy = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  const adr = occupiedRooms > 0 ? todayRevenue / occupiedRooms : 0;
  const revpar = totalRooms > 0 ? todayRevenue / totalRooms : 0;

  return {
    todayRevenue: { value: todayRevenue, change: 0 },
    monthlyRevenue: { value: monthlyRevenue, change: 0 },
    occupancy: { value: occupancy, change: 0 },
    adr: { value: adr, change: 0 },
    revpar: { value: revpar, change: 0 },
    bookings: { value: monthlyBookings.length, change: 0 },
    conversionRate: { value: 0, change: 0 }, // Mocked
    cancellationRate: { value: 0, change: 0 }, // Mocked
  };
}

export async function getOccupancyMap(hotelId: string) {
  const rooms = await prisma.room.findMany({ where: { hotel_id: hotelId, is_active: true } });
  // Simplified: just returns rooms for now. A full implementation would check bookings and availability.
  return rooms.map(room => ({
    roomId: room.id,
    roomNumber: room.room_number,
    type: room.room_type,
    status: 'available', // Mocked
    floor: room.floor,
    bookingId: null,
    guestName: null,
  }));
}

export async function getUpcomingActivity(hotelId: string) {
    const today = new Date();
    const tomorrow = addDays(today, 1);

    const todayCheckIns = await prisma.booking.findMany({ where: { hotel_id: hotelId, check_in: { gte: startOfToday(), lte: endOfToday() } } });
    const tomorrowCheckIns = await prisma.booking.findMany({ where: { hotel_id: hotelId, check_in: { gte: tomorrow, lte: addDays(tomorrow, 1) } } });
    const thisWeekCheckIns = await prisma.booking.findMany({ where: { hotel_id: hotelId, check_in: { gte: startOfWeek(today), lte: endOfWeek(today) } } });

    const todayCheckOuts = await prisma.booking.findMany({ where: { hotel_id: hotelId, check_out: { gte: startOfToday(), lte: endOfToday() } } });
    const tomorrowCheckOuts = await prisma.booking.findMany({ where: { hotel_id: hotelId, check_out: { gte: tomorrow, lte: addDays(tomorrow, 1) } } });
    const thisWeekCheckOuts = await prisma.booking.findMany({ where: { hotel_id: hotelId, check_out: { gte: startOfWeek(today), lte: endOfWeek(today) } } });

    return {
        checkIns: { today: todayCheckIns, tomorrow: tomorrowCheckIns, thisWeek: thisWeekCheckIns },
        checkOuts: { today: todayCheckOuts, tomorrow: tomorrowCheckOuts, thisWeek: thisWeekCheckOuts },
    }
}

export async function getOccupancyForecast(hotelId: string, days: number = 90) {
  const forecast = [];
  // Mocked forecast
  for (let i = 0; i < days; i++) {
    const date = addDays(new Date(), i);
    forecast.push({
      date: date.toISOString().split('T')[0],
      predictedOccupancy: 70 + Math.sin(i / 10) * 15 + Math.random() * 5,
      confidence: 0.85,
      events: [],
      historicalOccupancy: 72,
    });
  }
  return forecast;
}
