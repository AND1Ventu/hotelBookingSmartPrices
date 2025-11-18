import prisma from '../../config/prisma';

export async function getHotels() {
  return prisma.hotel.findMany();
}

export async function getHotelById(id: string) {
  return prisma.hotel.findUnique({ where: { id } });
}

export async function createHotel(data: any) {
  return prisma.hotel.create({ data });
}

export async function updateHotel(id: string, data: any) {
  return prisma.hotel.update({ where: { id }, data });
}

export async function deleteHotel(id: string) {
  return prisma.hotel.delete({ where: { id } });
}
