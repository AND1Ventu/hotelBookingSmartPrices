import prisma from '../../config/prisma';

export async function getRooms(query: any) {
  const { hotelId, type, status, floor } = query;
  const where: any = {};
  if (hotelId) where.hotel_id = hotelId;
  if (type) where.room_type = type;
  if (status) where.is_active = status === 'active';
  if (floor) where.floor = parseInt(floor);

  return prisma.room.findMany({ where });
}

export async function getRoomById(id: string) {
  return prisma.room.findUnique({ where: { id } });
}

export async function createRoom(data: any) {
  return prisma.room.create({ data });
}

export async function updateRoom(id: string, data: any) {
  return prisma.room.update({ where: { id }, data });
}

export async function deleteRoom(id: string) {
  return prisma.room.delete({ where: { id } });
}
