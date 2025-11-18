import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create a Hotel
  const hotel = await prisma.hotel.create({
    data: {
      name: 'The Grand AI Hotel',
      email: 'contact@grandaihotel.com',
      password_hash: await bcrypt.hash('password123', 10),
      address: '123 AI Avenue',
      city: 'Techville',
      country: 'Synthetica',
      phone: '123-456-7890',
      property_type: 'business',
      amenities: {
        pool: true,
        gym: true,
        wifi: true,
        parking: true,
      },
    },
  });

  console.log(`Created hotel with id: ${hotel.id}`);

  // Create Users for different roles
  const roles = ['owner', 'manager', 'front_desk', 'housekeeping', 'accountant'];
  for (const role of roles) {
    await prisma.user.create({
      data: {
        hotel_id: hotel.id,
        email: `${role}@grandaihotel.com`,
        password_hash: await bcrypt.hash('password123', 10),
        full_name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        role: role,
        is_active: true,
      },
    });
    console.log(`Created ${role} user`);
  }

  // Create Room Types
  const roomTypes = [
    { type: 'Standard', base_price: 125, capacity_adults: 2, bed_type: 'Queen' },
    { type: 'Deluxe', base_price: 185, capacity_adults: 2, bed_type: 'King' },
    { type: 'Suite', base_price: 325, capacity_adults: 4, bed_type: 'King' },
  ];

  for (const roomType of roomTypes) {
    for (let i = 1; i <= 5; i++) {
      await prisma.room.create({
        data: {
          hotel_id: hotel.id,
          room_number: `${roomTypes.indexOf(roomType) + 1}0${i}`,
          room_type: roomType.type,
          capacity_adults: roomType.capacity_adults,
          capacity_children: 2,
          bed_type: roomType.bed_type,
          base_price: roomType.base_price,
          current_price: roomType.base_price,
          amenities: { wifi: true, tv: true, "air-conditioning": true },
          photos: [],
          is_active: true,
        },
      });
    }
  }
  console.log('Created rooms');

  // Create some bookings
  const rooms = await prisma.room.findMany({ where: { hotel_id: hotel.id } });
  for (let i = 0; i < 10; i++) {
    const room = rooms[i % rooms.length];
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + i * 2);
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + i * 2 + 3);

    await prisma.booking.create({
      data: {
        hotel_id: hotel.id,
        room_id: room.id,
        booking_reference: `BK-00${i + 1}`,
        guest_name: `Guest ${i + 1}`,
        guest_email: `guest${i+1}@test.com`,
        guest_phone: '987-654-3210',
        check_in: checkIn,
        check_out: checkOut,
        nights: 3,
        adults: 2,
        base_price: room.base_price,
        total_price: Number(room.base_price) * 3,
        status: 'confirmed',
        payment_status: 'paid',
        booking_source: 'direct',
      },
    });
  }
  console.log('Created bookings');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
