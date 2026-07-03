import {
  PrismaClient,
  Role,
  SparePartType,
  BookingStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { phone: '9133373330' },
    update: {},
    create: {
      name: 'Victory Demo Service Center',
      phone: '9133373330',
      role: Role.SERVICE_CENTER,
    },
  });

  const serviceCenter = await prisma.serviceCenter.upsert({
    where: { phone: '9133373330' },
    update: {},
    create: {
      name: 'Victory Auto Service Center',
      city: 'Hyderabad',
      address: 'Madhapur, Hyderabad',
      phone: '9133373330',
      status: 'ACTIVE',
      creditLimit: 50000,
      usedCredit: 0,
      outstandingAmount: 0,
      userId: user.id,
    },
  });

  await prisma.sparePart.createMany({
    data: [
      {
        name: 'Engine Oil 5W30',
        partNumber: 'VOW-OIL-5W30',
        category: 'Lubricants',
        brand: 'Victory',
        unit: 'Litre',
        stockQty: 50,
        price: 650,
        type: SparePartType.OEM,
      },
      {
        name: 'Oil Filter',
        partNumber: 'VOW-OF-001',
        category: 'Filters',
        brand: 'Bosch',
        unit: 'Piece',
        stockQty: 40,
        price: 350,
        type: SparePartType.OEM,
      },
      {
        name: 'Air Filter',
        partNumber: 'VOW-AF-001',
        category: 'Filters',
        brand: 'Minda',
        unit: 'Piece',
        stockQty: 35,
        price: 450,
        type: SparePartType.OES,
      },
      {
        name: 'Brake Pad Set',
        partNumber: 'VOW-BP-001',
        category: 'Braking',
        brand: 'TVS',
        unit: 'Set',
        stockQty: 25,
        price: 1800,
        type: SparePartType.OEM,
      },
      {
        name: 'Spark Plug',
        partNumber: 'VOW-SP-001',
        category: 'Ignition',
        brand: 'NGK',
        unit: 'Piece',
        stockQty: 60,
        price: 220,
        type: SparePartType.OES,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.booking.createMany({
    data: [
      {
        customerName: 'Ravi Kumar',
        customerPhone: '9876543210',
        vehicleNumber: 'TS09AB1234',
        vehicleType: 'Car',
        serviceType: 'General Service',
        bookingDate: new Date(),
        status: BookingStatus.CONFIRMED,
        notes: 'Demo booking',
        serviceCenterId: serviceCenter.id,
      },
      {
        customerName: 'Suresh Reddy',
        customerPhone: '9876501234',
        vehicleNumber: 'TS10CD5678',
        vehicleType: 'Bike',
        serviceType: 'Oil Change',
        bookingDate: new Date(),
        status: BookingStatus.PENDING,
        notes: 'Demo booking',
        serviceCenterId: serviceCenter.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data inserted successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
