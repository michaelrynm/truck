const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  console.log('Creating users...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dumptruck.com' },
    update: {},
    create: {
      email: 'admin@dumptruck.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const manager1 = await prisma.user.upsert({
    where: { email: 'manager1@dumptruck.com' },
    update: {},
    create: {
      email: 'manager1@dumptruck.com',
      password: hashedPassword,
      name: 'Manager One',
      role: 'MANAGER',
    },
  });

  const manager2 = await prisma.user.upsert({
    where: { email: 'manager2@dumptruck.com' },
    update: {},
    create: {
      email: 'manager2@dumptruck.com',
      password: hashedPassword,
      name: 'Manager Two',
      role: 'MANAGER',
    },
  });

  const driver1User = await prisma.user.upsert({
    where: { email: 'driver1@dumptruck.com' },
    update: {},
    create: {
      email: 'driver1@dumptruck.com',
      password: hashedPassword,
      name: 'Driver One',
      role: 'DRIVER',
    },
  });

  const driver2User = await prisma.user.upsert({
    where: { email: 'driver2@dumptruck.com' },
    update: {},
    create: {
      email: 'driver2@dumptruck.com',
      password: hashedPassword,
      name: 'Driver Two',
      role: 'DRIVER',
    },
  });

  const driver3User = await prisma.user.upsert({
    where: { email: 'driver3@dumptruck.com' },
    update: {},
    create: {
      email: 'driver3@dumptruck.com',
      password: hashedPassword,
      name: 'Driver Three',
      role: 'DRIVER',
    },
  });

  console.log('Users created successfully');

  // Create Drivers
  console.log('Creating drivers...');
  const driver1 = await prisma.driver.upsert({
    where: { licenseNumber: 'DL001' },
    update: {},
    create: {
      name: 'John Doe',
      licenseNumber: 'DL001',
      phone: '+1234567890',
      address: '123 Main Street, New York, NY 10001',
      status: 'ACTIVE',
      userId: driver1User.id,
    },
  });

  const driver2 = await prisma.driver.upsert({
    where: { licenseNumber: 'DL002' },
    update: {},
    create: {
      name: 'Jane Smith',
      licenseNumber: 'DL002',
      phone: '+1234567891',
      address: '456 Oak Avenue, Los Angeles, CA 90001',
      status: 'ACTIVE',
      userId: driver2User.id,
    },
  });

  const driver3 = await prisma.driver.upsert({
    where: { licenseNumber: 'DL003' },
    update: {},
    create: {
      name: 'Bob Johnson',
      licenseNumber: 'DL003',
      phone: '+1234567892',
      address: '789 Pine Road, Chicago, IL 60601',
      status: 'ACTIVE',
      userId: driver3User.id,
    },
  });

  console.log('Drivers created successfully');

  // Create Dump Trucks
  console.log('Creating dump trucks...');
  const truck1 = await prisma.dumpTruck.upsert({
    where: { plateNumber: 'ABC-1234' },
    update: {},
    create: {
      plateNumber: 'ABC-1234',
      brand: 'Hino',
      model: 'FM 260 JD',
      year: 2022,
      type: '10 Wheeler',
      capacity: 10,
      status: 'READY',
    },
  });

  const truck2 = await prisma.dumpTruck.upsert({
    where: { plateNumber: 'DEF-5678' },
    update: {},
    create: {
      plateNumber: 'DEF-5678',
      brand: 'Mitsubishi',
      model: 'Fuso FN 527',
      year: 2021,
      type: '6 Wheeler',
      capacity: 6,
      status: 'READY',
    },
  });

  const truck3 = await prisma.dumpTruck.upsert({
    where: { plateNumber: 'GHI-9012' },
    update: {},
    create: {
      plateNumber: 'GHI-9012',
      brand: 'Isuzu',
      model: 'Giga FVZ',
      year: 2023,
      type: '10 Wheeler',
      capacity: 10,
      status: 'READY',
    },
  });

  const truck4 = await prisma.dumpTruck.upsert({
    where: { plateNumber: 'JKL-3456' },
    update: {},
    create: {
      plateNumber: 'JKL-3456',
      brand: 'Hino',
      model: 'Ranger FM 260',
      year: 2020,
      type: '6 Wheeler',
      capacity: 6,
      status: 'READY',
    },
  });

  const truck5 = await prisma.dumpTruck.upsert({
    where: { plateNumber: 'MNO-7890' },
    update: {},
    create: {
      plateNumber: 'MNO-7890',
      brand: 'UD Trucks',
      model: 'Quester CWE 280',
      year: 2019,
      type: '10 Wheeler',
      capacity: 10,
      status: 'MAINTENANCE',
    },
  });

  console.log('Dump trucks created successfully');

  // Create Contracts
  console.log('Creating contracts...');
  const contract1 = await prisma.contract.create({
    data: {
      clientName: 'ABC Construction',
      location: 'New York City',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      numberOfTrucks: 3,
      price: 150000.00,
      physicalActivityPercentage: 75.5,
      status: 'ACTIVE',
      description: 'Construction site material hauling',
    },
  });

  const contract2 = await prisma.contract.create({
    data: {
      clientName: 'XYZ Developers',
      location: 'Los Angeles',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      numberOfTrucks: 2,
      price: 200000.00,
      physicalActivityPercentage: 80.0,
      status: 'ACTIVE',
      description: 'Demolition debris removal',
    },
  });

  const contract3 = await prisma.contract.create({
    data: {
      clientName: 'Metro Infrastructure',
      location: 'Chicago',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2024-01-31'),
      numberOfTrucks: 5,
      price: 180000.00,
      physicalActivityPercentage: 95.0,
      status: 'COMPLETED',
      description: 'Road construction material transport',
    },
  });

  console.log('Contracts created successfully');

  // Create Schedules
  console.log('Creating schedules...');
  const schedule1 = await prisma.schedule.create({
    data: {
      contractId: contract1.id,
      dumpTruckId: truck1.id,
      driverId: driver1.id,
      date: new Date('2024-03-15'),
      startTime: '08:00',
      endTime: '16:00',
      status: 'COMPLETED',
    },
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      contractId: contract2.id,
      dumpTruckId: truck2.id,
      driverId: driver2.id,
      date: new Date('2024-03-16'),
      startTime: '09:00',
      endTime: '17:00',
      status: 'SCHEDULED',
    },
  });

  const schedule3 = await prisma.schedule.create({
    data: {
      contractId: contract1.id,
      dumpTruckId: truck3.id,
      driverId: driver3.id,
      date: new Date('2024-03-17'),
      startTime: '07:00',
      endTime: '15:00',
      status: 'SCHEDULED',
    },
  });

  console.log('Schedules created successfully');

  // Create Activity Logs
  console.log('Creating activity logs...');
  await prisma.activityLog.create({
    data: {
      scheduleId: schedule1.id,
      driverId: driver1.id,
      dumpTruckId: truck1.id,
      date: new Date('2024-03-15'),
      startTime: '08:00',
      endTime: '16:00',
      numberOfLoads: 5,
      location: 'New York City - Construction Site A',
      workingHours: 8,
      notes: 'Completed hauling 5 loads of construction materials',
    },
  });

  await prisma.activityLog.create({
    data: {
      scheduleId: schedule2.id,
      driverId: driver2.id,
      dumpTruckId: truck2.id,
      date: new Date('2024-03-16'),
      startTime: '09:00',
      endTime: '17:00',
      numberOfLoads: 4,
      location: 'Los Angeles - Demolition Site B',
      workingHours: 8,
      notes: 'Debris removal from demolition site',
    },
  });

  console.log('Activity logs created successfully');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
