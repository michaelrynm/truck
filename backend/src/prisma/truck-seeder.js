const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Create Dump Trucks
  for (let i = 0; i < 29; i++) {
    console.log(`Creating dump truck: ${i + 1}/29`);
    const truck = await prisma.dumpTruck.create({
      data: {
        plateNumber: `BG ${1612 + i} DL`, // Generate unique plate numbers
        brand: "Hino FM",
        model: "FM 350",
        year: 2020,
        type: "6 Wheels",
        capacity: 9,
        status: "READY",
      },
    });
  }

  console.log("Dump trucks created successfully");
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });